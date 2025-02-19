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
import { Label } from "@/components/ui/label";
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
	PaginationLink,
	PaginationPrevious,
} from "@/components/ui/pagination";

export default function EmailsSubscribedPage() {
	const [emails, setEmails] = useState([]);
	const [filteredEmails, setFilteredEmails] = useState([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const emailsPerPage = 15;
	const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

	useEffect(() => {
		const fetchEmails = async () => {
			setLoading(true);
			try {
				const response = await axios.get("/api/newsletter");
				setEmails(response.data.emails);
				setFilteredEmails(response.data.emails);
			} catch (error) {
				toast.error("Failed to fetch emails");
			}
			setLoading(false);
		};
		fetchEmails();
	}, []);

	useEffect(() => {
		if (search.trim()) {
			setFilteredEmails(
				emails.filter((email) =>
					email.email.toLowerCase().includes(search.toLowerCase())
				)
			);
		} else {
			setFilteredEmails(emails);
		}
	}, [search, emails]);

	const indexOfLastEmail = currentPage * emailsPerPage;
	const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
	const currentEmails = filteredEmails.slice(
		indexOfFirstEmail,
		indexOfLastEmail
	);

	const handleNext = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrev = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const handlePageChange = (i) => {
		setCurrentPage(i);
	}

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
									Emails Subscribed
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className="p-6 space-y-6">
				<h1 className="text-3xl font-bold">Emails Subscribed</h1>
				<Card>
					<CardHeader>
						<CardTitle>Search Emails</CardTitle>
						<CardDescription>
							Filter emails by typing below.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Input
							type="text"
							placeholder="Search email..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Subscribed Emails</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Email</TableHead>
									<TableHead>Subscribed At</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell colSpan="2">
											Loading...
										</TableCell>
									</TableRow>
								) : (
									currentEmails.map((email, index) => (
										<TableRow key={index}>
											<TableCell>{email.email}</TableCell>
											<TableCell>
												{new Date(
													email.subscribedAt
												).toLocaleDateString()}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
					<CardFooter>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={handlePrev}
										disabled={currentPage === 1}
										className={`cursor-pointer`}
									/>
								</PaginationItem>
								{Array.from({ length: totalPages }, (_, i) => (
									<PaginationItem key={i + 1}>
										<PaginationLink
											onClick={() =>
												handlePageChange(i + 1)
											}
											className={`cursor-pointer`}
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
