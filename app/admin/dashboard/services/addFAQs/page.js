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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function AddFaqPage() {
	const [services, setServices] = useState([]);
	const [selectedServiceId, setSelectedServiceId] = useState("");
	const [faq, setFaq] = useState({ question: "", answer: "" });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await axios.get("/api/service");
				setServices(response.data);
			} catch (error) {
				toast.error("Failed to fetch services");
			}
		};
		fetchServices();
	}, []);

	const handleInputChange = (e) => {
		setFaq({ ...faq, [e.target.name]: e.target.value });
	};

	const validateFields = () => {
		if (!selectedServiceId || !faq.question.trim() || !faq.answer.trim()) {
			toast.error("Please fill in all required fields.");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateFields()) return;
		setLoading(true);

		try {
			const admin = localStorage.getItem("admin");
			const { token } = JSON.parse(admin);
			if (!token) throw new Error("No authentication token found.");

			await axios.post(
				"/api/service/faq",
				{ ...faq, service_id: selectedServiceId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			toast.success("FAQ added successfully!");
			setFaq({ question: "", answer: "" });
			setSelectedServiceId("");
		} catch (error) {
			toast.error("Failed to add FAQ. Please try again.");
			console.error(error.message);
		}
		setLoading(false);
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
								<BreadcrumbPage>Add FAQ</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className="p-6 space-y-6">
				<h1 className="text-3xl font-bold">Add FAQ</h1>
				<Card>
					<CardHeader>
						<CardTitle>Select Service</CardTitle>
						<CardDescription>
							Choose a service to add FAQ.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Select
							onValueChange={setSelectedServiceId}
							value={selectedServiceId}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a service" />
							</SelectTrigger>
							<SelectContent>
								{services.map((s) => (
									<SelectItem key={s._id} value={s._id}>
										{s.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Add FAQ</CardTitle>
						<CardDescription>
							Enter the question and answer for the new FAQ.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="question">Question</Label>
							<Input
								id="question"
								name="question"
								value={faq.question}
								onChange={handleInputChange}
								placeholder="Enter the question"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="answer">Answer</Label>
							<Textarea
								id="answer"
								name="answer"
								value={faq.answer}
								onChange={handleInputChange}
								placeholder="Enter the answer"
								required
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button onClick={handleSubmit} disabled={loading}>
							{loading ? "Adding..." : "Add FAQ"}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}
