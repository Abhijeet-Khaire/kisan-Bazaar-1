import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, BookOpen } from "lucide-react";

export default function Training() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-12">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl font-bold mb-4">Farmer Training Academy</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Simple, step-by-step guides to help you master digital farming.
                        Designed for everyone, from beginners to experts.
                    </p>
                </div>

                {/* Featured Course */}
                <div className="mb-12">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-8 grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                    New Course
                                </div>
                                <h2 className="text-3xl font-bold">Digital Farming 101</h2>
                                <p className="text-muted-foreground text-lg">
                                    Learn how to list crops, negotiate prices, and handle payments safely on KisanBazaar.
                                </p>
                                <Button size="lg" className="gap-2">
                                    <PlayCircle className="h-5 w-5" />
                                    Start Learning
                                </Button>
                            </div>
                            <div className="aspect-video rounded-xl bg-muted relative overflow-hidden flex items-center justify-center group cursor-pointer shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                                    alt="Training Video"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                    <PlayCircle className="h-16 w-16 text-white opacity-90" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Educational Resources Grid */}
                <h3 className="text-2xl font-bold mb-6">Learning Modules</h3>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Crop Quality Standards
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Understand the grading system (A, B, C) and how to grade your produce correctly.
                            </p>
                            <Button variant="outline" className="w-full">Read Guide</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Smart Packaging
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Best practices for packaging to reduce spoilage during transport.
                            </p>
                            <Button variant="outline" className="w-full">View Checklist</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PlayCircle className="h-5 w-5 text-primary" />
                                Market Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                How to read price analytics charts and decide when to sell.
                            </p>
                            <Button variant="outline" className="w-full">Watch Video</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Embedded External Resource (Simulation) */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-6">Interactive Learning Zone</h3>
                    <Card className="overflow-hidden bg-muted/30">
                        <CardContent className="p-0">
                            <div className="aspect-[16/9] w-full">
                                <iframe
                                    src="https://www.agclassroom.org/"
                                    title="Agricultural Learning Resource"
                                    className="w-full h-full border-0"
                                />
                            </div>
                            <div className="p-4 bg-muted/50 text-sm text-center text-muted-foreground">
                                Explore external agricultural resources directly within our platform.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
