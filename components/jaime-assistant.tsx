"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { Copy, MoreHorizontal, Star, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./chat-header";
import { ChatInputArea } from "./chat-input-area";
import { JaimeLogo } from "./jaime-logo";
import { Markdown } from "./markdown";

// Interface declarations
interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

interface ChatHistory {
	id: string;
	title: string;
	messages: Message[];
	timestamp: Date;
}

const SUGGESTED_PROMPTS = [
	"Show me case studies in ...",
	"What do you do best?",
	"Summarize this page",
	"Talk to an expert",
];

const CHAT_HISTORY: ChatHistory[] = [
	{
		id: "1",
		title: "Case studies related to GenAI.",
		messages: [],
		timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
	},
	{
		id: "2",
		title: "Bug Report",
		messages: [],
		timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
	},
	{
		id: "3",
		title: "Expertise in Generative AI Systems Evaluation",
		messages: [],
		timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
	},
	{
		id: "4",
		title: "Generation of proposal for a real estate age",
		messages: [],
		timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
	},
	{
		id: "5",
		title: "List of projects in the financial industry",
		messages: [],
		timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
	},
	{
		id: "6",
		title: "Summarize a whitepaper on AI in marketing",
		messages: [],
		timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
	},
];

export function JaimeAssistant() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [currentChatId, setCurrentChatId] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [animationComplete, setAnimationComplete] = useState(true); // Track animation completion
	const [isUserScrolling, setIsUserScrolling] = useState(false); // Track if user is scrolling

	// Initialize chat with AI SDK
	const { messages, input, handleInputChange, handleSubmit, append, stop, error, status, setInput } = useChat({
		api: "/api/chat",
		id: "jaime-chat",
		experimental_throttle: 100, // From the Vercel AI Chatbot example
		onError: (err) => {
			console.error("AI SDK error:", err);
		},
	});

	// Check if user is at the bottom of the chat
	const isUserAtBottom = () => {
		const container = chatContainerRef.current;
		if (!container) return true;

		// In a flex-column-reverse container, "bottom" is actually the top (scrollTop near 0)
		return container.scrollTop < 10;
	};

	// Scroll to bottom of chat
	const scrollToBottom = () => {
		if (chatContainerRef.current && !isUserScrolling) {
			// In flex-column-reverse, scroll to bottom means scrolling to top (0)
			chatContainerRef.current.scrollTop = 0;
		}
	};

	// Scroll to bottom whenever messages change or when status changes
	useEffect(() => {
		// Only auto-scroll if user is at bottom or they just sent a message
		if (messages.length > 0 && (isUserAtBottom() || messages[0]?.role === "user")) {
			scrollToBottom();
		}
	}, [messages, status]);

	// Handle scroll events to detect user scrolling
	useEffect(() => {
		const container = chatContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			// Only consider it user scrolling if they've explicitly scrolled away from bottom
			const isAtBottom = isUserAtBottom();
			if (!isAtBottom) {
				setIsUserScrolling(true);
			} else if (isUserScrolling && isAtBottom) {
				// If they scrolled back to bottom, reset the flag
				setIsUserScrolling(false);
			}
		};

		container.addEventListener("scroll", handleScroll);
		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, [isUserScrolling]);

	// Reset userScrolling when user explicitly sends a message
	useEffect(() => {
		// In a reversed layout, we need to check if the newest message is from the user
		const latestMessage = messages[0];
		if (messages.length > 0 && latestMessage?.role === "user") {
			setIsUserScrolling(false);
			// Ensure immediate scroll to bottom after sending a message
			setTimeout(scrollToBottom, 0);
		}
	}, [messages]);

	// Helper function to format AI SDK messages to UI messages
	const formattedMessages = messages.map((msg) => ({
		id: msg.id,
		role: msg.role as "user" | "assistant",
		content: msg.content,
		timestamp: new Date(msg.createdAt || Date.now()),
	}));

	// Scroll to bottom when AI begins typing (status becomes "submitted")
	useEffect(() => {
		if (status === "submitted" && messages.length > 0 && messages[0].role === "user") {
			// Ensure we scroll to see the "Writing..." indicator
			setTimeout(scrollToBottom, 0);
		}
	}, [status]);

	// Handle window resize events
	useEffect(() => {
		let resizeTimeout: NodeJS.Timeout;

		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				if (!isUserScrolling) {
					scrollToBottom();
				}
			}, 100);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(resizeTimeout);
		};
	}, [isUserScrolling]);

	// Handle clicking on a suggested prompt
	const handlePromptClick = (prompt: string) => {
		if (prompt === "Talk to an expert") {
			append({
				role: "user",
				content: "Tell me about your company relationships with InterSystems",
			});
		} else {
			append({
				role: "user",
				content: prompt,
			});
		}
	};

	// Group chats by time period for sidebar organization
	const groupChatsByTime = (chats: ChatHistory[]) => {
		const now = new Date();
		const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		const groups = {
			yesterday: chats.filter((chat) => chat.timestamp > yesterday),
			week: chats.filter((chat) => chat.timestamp <= yesterday && chat.timestamp > weekAgo),
			month: chats.filter((chat) => chat.timestamp <= weekAgo && chat.timestamp > monthAgo),
		};

		return groups;
	};

	// Define an effect to handle class changes immediately when collapsing
	useEffect(() => {
		// No need to do anything special when expanding
		if (isExpanded) return;

		// When collapsing, we want to remove animation classes immediately
		setAnimationComplete(false);
	}, [isExpanded]);

	// Only animate when expanding
	const expandSpringTransition = {
		type: "spring",
		stiffness: 300,
		damping: 30,
		duration: 0.3,
	};

	return (
		<motion.div
			className={cn(
				"text-white flex flex-col rounded-2xl overflow-hidden shadow-[0_0_25px_3px_rgba(246,141,46,0.7)] bg-[#0F1827]",
				isExpanded ? "fixed inset-5 w-auto h-auto" : "relative w-[400px] h-[718px]"
			)}
			animate={{
				scale: 1,
				transition: isExpanded ? expandSpringTransition : { duration: 0 },
			}}
			layoutId="assistantContainer"
		>
			{/* Main container with optional sidebar */}
			<div className="flex flex-1 h-full overflow-hidden">
				{/* Sidebar - Only visible when expanded */}
				{isExpanded && (
					<div className="w-96 bg-slate-800 flex flex-col shrink-0">
						{/* Sidebar Header */}
						<div className="p-4 bg-[#030B16]">
							<div className="flex items-center mb-4">
								<div className="flex items-center space-x-2">
									<JaimeLogo className="w-6 h-6" />
									<span className="text-lg font-semibold">Jaime AI Assistant</span>
								</div>
							</div>

							<div className="flex space-x-2">
								<Button
									variant="outline"
									size="sm"
									className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
									onClick={() => {
										// Clear current chat
										window.location.reload();
									}}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="mr-2"
									>
										<path
											d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M9 15H15M12 18V12M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									New Chat
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Clear All
								</Button>
							</div>
						</div>

						{/* Chat History */}
						<ScrollArea className="flex-1 p-4 bg-[#030B16]">
							{(() => {
								const groups = groupChatsByTime(CHAT_HISTORY);
								return (
									<div className="space-y-6">
										{groups.yesterday.length > 0 && (
											<div>
												<h3 className="text-sm font-medium text-slate-400 mb-3">Yesterday</h3>
												<div className="space-y-2">
													{groups.yesterday.map((chat) => (
														<div
															key={chat.id}
															className="p-3 rounded-lg bg-transparent hover:bg-slate-600 cursor-pointer transition-colors"
															onClick={() => setCurrentChatId(chat.id)}
														>
															<div className="text-sm text-[#A7B0C2] truncate">
																{chat.title}
															</div>
														</div>
													))}
												</div>
											</div>
										)}

										{groups.week.length > 0 && (
											<div>
												<h3 className="text-sm font-medium text-slate-400 mb-3">
													Previous 7 days
												</h3>
												<div className="space-y-2">
													{groups.week.map((chat) => (
														<div
															key={chat.id}
															className="p-3 rounded-lg bg-transparent hover:bg-slate-600 cursor-pointer transition-colors group"
															onClick={() => setCurrentChatId(chat.id)}
														>
															<div className="flex items-center justify-between">
																<div className="text-sm text-[#A7B0C2] truncate flex-1">
																	{chat.title}
																</div>
																<Button
																	variant="ghost"
																	size="icon"
																	className="opacity-0 group-hover:opacity-100 w-6 h-6 text-slate-400 hover:text-white"
																>
																	<MoreHorizontal className="w-4 h-4" />
																</Button>
															</div>
														</div>
													))}
												</div>
											</div>
										)}

										{groups.month.length > 0 && (
											<div>
												<h3 className="text-sm font-medium text-slate-400 mb-3">
													Previous 30 days
												</h3>
												<div className="space-y-2">
													{groups.month.map((chat) => (
														<div
															key={chat.id}
															className="p-3 rounded-lg bg-transparent hover:bg-slate-600 cursor-pointer transition-colors"
															onClick={() => setCurrentChatId(chat.id)}
														>
															<div className="text-sm text-[#A7B0C2] truncate">
																{chat.title}
															</div>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								);
							})()}
						</ScrollArea>
					</div>
				)}

				{/* Main Chat Area */}
				<div className="flex-1 flex flex-col relative">
					{/* Use the ChatHeader component */}
					<ChatHeader
						isExpanded={isExpanded}
						onToggleExpand={() => setIsExpanded(!isExpanded)}
						onClose={() => {}}
					/>

					{/* Chat Messages */}
					<div
						ref={chatContainerRef}
						className={cn(
							"flex-1 overflow-y-auto relative bg-no-repeat bg-center flex flex-col-reverse",
							isExpanded ? "p-6" : "p-4"
						)}
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='146' height='230' viewBox='0 0 146 230' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M73.0382 130.486L43.6858 159.779L114.322 230L143.675 200.706L73.0382 130.486Z' fill='%23141F2F'/%3E%3Cpath d='M116.609 86.9645L43.6858 159.741L73.0764 188.996L146 116.22L116.609 86.9645Z' fill='%23141F2F'/%3E%3Cpath d='M116.533 0L0 116.335L29.3906 145.59L145.924 29.2554L116.533 0Z' fill='%23141F2F'/%3E%3C/svg%3E")`,
							backgroundSize: isExpanded ? "146px 230px" : "105px 165px",
						}}
					>
						{formattedMessages.length === 0 ? (
							<div
								className={cn(
									"flex flex-col justify-end h-full pb-4",
									isExpanded ? "max-w-4xl mx-auto w-full" : ""
								)}
							>
								<h1 className={cn("font-semibold text-4xl mb-2", isExpanded ? "" : "px-4")}>
									{"Hi! I'm Jaime, your AI Assistant. How can I help?"}
								</h1>
							</div>
						) : (
							<div
								className={cn(
									"flex flex-col-reverse",
									isExpanded
										? "space-y-6 space-y-reverse max-w-4xl mx-auto w-full"
										: "space-y-4 space-y-reverse"
								)}
							>
								{status === "submitted" &&
									formattedMessages.length > 0 &&
									formattedMessages[0].role === "user" && (
										<div className="flex items-center space-x-2 animate-pulse mb-6 ml-1 mt-2">
											<div className="w-4 h-4 bg-white rounded-full"></div>
											<div className="text-white">Writing...</div>
										</div>
									)}
								{[...formattedMessages].reverse().map((message) => (
									<div key={message.id} className={isExpanded ? "space-y-4 mb-4" : "mb-4"}>
										{message.role === "user" && (
											<div className="flex justify-start">
												<div className="flex items-start space-x-[5px]">
													<svg
														className="flex-shrink-0"
														width="36"
														height="39"
														viewBox="0 0 36 39"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<g filter="url(#filter0_d_4010_2014)">
															<path
																d="M18 26.5H27M22.376 10.122C22.7741 9.72389 23.314 9.50024 23.877 9.50024C24.44 9.50024 24.9799 9.72389 25.378 10.122C25.7761 10.5201 25.9997 11.06 25.9997 11.623C25.9997 12.186 25.7761 12.7259 25.378 13.124L13.368 25.135C13.1301 25.3729 12.836 25.5469 12.513 25.641L9.64098 26.479C9.55493 26.5041 9.46372 26.5056 9.37689 26.4833C9.29006 26.4611 9.2108 26.4159 9.14742 26.3525C9.08404 26.2892 9.03887 26.2099 9.01662 26.1231C8.99437 26.0362 8.99588 25.945 9.02098 25.859L9.85898 22.987C9.9532 22.6643 10.1272 22.3706 10.365 22.133L22.376 10.122Z"
																stroke="#687389"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</g>
														<defs>
															<filter
																id="filter0_d_4010_2014"
																x="-6"
																y="-3.5"
																width="48"
																height="48"
																filterUnits="userSpaceOnUse"
																colorInterpolationFilters="sRGB"
															>
																<feFlood floodOpacity="0" result="BackgroundImageFix" />
																<feColorMatrix
																	in="SourceAlpha"
																	type="matrix"
																	values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
																	result="hardAlpha"
																/>
																<feOffset dy="2" />
																<feGaussianBlur stdDeviation="3" />
																<feComposite in2="hardAlpha" operator="out" />
																<feColorMatrix
																	type="matrix"
																	values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
																/>
																<feBlend
																	mode="normal"
																	in2="BackgroundImageFix"
																	result="effect1_dropShadow_4010_2014"
																/>
																<feBlend
																	mode="normal"
																	in="SourceGraphic"
																	in2="effect1_dropShadow_4010_2014"
																	result="shape"
																/>
															</filter>
														</defs>
													</svg>
													<div className="bg-[#1E293B] p-3 rounded-lg text-white text-[14px]">
														{message.content}
													</div>
												</div>
											</div>
										)}

										{message.role === "assistant" && (
											<div className={isExpanded ? "" : "space-y-3"}>
												<div
													className={cn(
														"text-white w-full max-w-full break-words",
														isExpanded ? "mb-4" : "text-sm leading-relaxed"
													)}
												>
													<div className="overflow-hidden max-w-full">
														<Markdown>{message.content}</Markdown>
														{/* The latest message being streamed will be the first one in our reversed list */}
														{status === "streaming" &&
															messages.find((msg) => msg.id === message.id)?.role ===
																"assistant" &&
															messages[0].id === message.id && (
																<span className="inline-block animate-pulse">▌</span>
															)}
													</div>
												</div>
												<div className="flex items-center space-x-2 mb-4">
													<Button
														variant="ghost"
														size="icon"
														className={cn(
															"text-slate-400 hover:text-white",
															!isExpanded && "w-8 h-8"
														)}
													>
														<ThumbsUp className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className={cn(
															"text-slate-400 hover:text-white",
															!isExpanded && "w-8 h-8"
														)}
													>
														<ThumbsDown className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className={cn(
															"text-slate-400 hover:text-white",
															!isExpanded && "w-8 h-8"
														)}
													>
														<Star className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className={cn(
															"text-slate-400 hover:text-white",
															!isExpanded && "w-8 h-8"
														)}
													>
														<Copy className="w-4 h-4" />
													</Button>
												</div>
											</div>
										)}
									</div>
								))}

								<div ref={messagesEndRef} className="h-0 w-full" />
							</div>
						)}
					</div>

					{/* Suggested Prompts */}
					<div className={cn("pb-2", isExpanded ? "max-w-4xl mx-auto w-full px-6" : "px-4")}>
						<div className="mt-2 flex flex-wrap gap-2">
							{SUGGESTED_PROMPTS.map((prompt, index) => (
								<Button
									key={index}
									variant="outline"
									size="sm"
									className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 text-xs"
									onClick={() => handlePromptClick(prompt)}
								>
									{prompt}
								</Button>
							))}
						</div>
					</div>

					{/* Input Area */}
					<div>
						<ChatInputArea
							inputValue={input}
							setInputValue={(value) => {
								setInput(value);
							}}
							handleSendMessage={(content) => {
								if (status === "streaming") {
									stop();
								} else if (content.trim()) {
									// Reset scrolling flag when sending a message
									setIsUserScrolling(false);
									append({
										role: "user",
										content: content,
									});
									setTimeout(scrollToBottom, 0);
								}
							}}
							isExpanded={isExpanded}
							errorMessage={error ? error.message || "Something went wrong" : null}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
