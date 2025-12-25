import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface QuizCardProps {
    question: string
    options: string[]
    onAnswer: (answer: string) => void
}

export function QuizCard({ question, options, onAnswer }: QuizCardProps) {
    return (
        <Card className="w-[350px] border-none shadow-xl bg-white/90 backdrop-blur-sm dark:bg-slate-950/90">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-red-600 dark:text-red-400">Christmas Quiz</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">Test your holiday knowledge!</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">{question}</h3>
                        <div className="grid gap-2">
                            {options.map((option, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="w-full justify-start hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all duration-200"
                                    onClick={() => onAnswer(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-slate-400">
                <span>Question 1 of 10</span>
                <span>Score: 0</span>
            </CardFooter>
        </Card>
    )
}
