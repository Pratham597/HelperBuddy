"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
	PaginationLink, // Add this import
} from "@/components/ui/pagination";

export default function ConnectUsMessagesPage() {
	const [messages, setMessages] = useState([]);
	const [filteredMessages, setFilteredMessages] = useState([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const messagesPerPage = 10;
	const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

	useEffect(() => {
		const fetchMessages = async () => {
			setLoading(true);
			try {
				const response = await axios.get("/api/user/complaint");
				setMessages(response.data.complaints);
				setFilteredMessages(response.data.complaints);
			} catch (error) {
				toast.error("Failed to fetch messages");
			}
			setLoading(false);
		};
		fetchMessages();
	}, []);

	useEffect(() => {
		if (search.trim()) {
			setFilteredMessages(
				messages.filter((message) =>
					message.message.toLowerCase().includes(search.toLowerCase())
				)
			);
		} else {
			setFilteredMessages(messages);
		}
		setCurrentPage(1); // Reset to the first page when search changes
	}, [search, messages]);

	const indexOfLastMessage = currentPage * messagesPerPage;
	const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
	const currentMessages = filteredMessages.slice(
		indexOfFirstMessage,
		indexOfLastMessage
	);

	const handleNext = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrev = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<Link href={`/admin/dashboard`}>Admin</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>
									Contact Us Messages
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className="p-6 space-y-6">
				<h1 className="text-3xl font-bold">Contact Us Messages</h1>
				<Card>
					<CardHeader>
						<CardTitle>Search Messages</CardTitle>
						<CardDescription>
							Filter messages by typing below.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Input
							type="text"
							placeholder="Search message..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Received Messages</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Message</TableHead>
									<TableHead>Received At</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell colSpan="4">
											Loading...
										</TableCell>
									</TableRow>
								) : (
									currentMessages.map((message, index) => (
										<TableRow key={index}>
											<TableCell>
												{message.firstName}{" "}
												{message.lastName}
											</TableCell>
											<TableCell>
												{message.email}
											</TableCell>
											<TableCell>
												{message.message}
											</TableCell>
											<TableCell>
												{new Date(
													message.createdAt
												).toLocaleDateString()}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
					<CardFooter className="flex justify-center">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={handlePrev}
										className={`cursor-pointer`}
										disabled={currentPage === 1}
									/>
								</PaginationItem>
								{Array.from({ length: totalPages }, (_, i) => (
									<PaginationItem key={i + 1}>
										<PaginationLink
											className={`cursor-pointer`}
											onClick={() =>
												handlePageChange(i + 1)
											}
											isActive={currentPage === i + 1}
										>
											{i + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									<PaginationNext
										onClick={handleNext}
										className={`cursor-pointer`}
										disabled={currentPage === totalPages}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}
