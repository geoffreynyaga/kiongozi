"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import {CalendarIcon, TrendingUpIcon, UsersIcon} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import AnalyticsTab from "./analytics";
import {Button} from "@/components/ui/button";
import {useState} from "react";

// Mock data for charts
const constituencyData = [
    {name: "Constituency A", voters: 50000, supporters: 30000},
    {name: "Constituency B", voters: 45000, supporters: 25000},
    {name: "Constituency C", voters: 55000, supporters: 35000},
    {name: "Constituency D", voters: 40000, supporters: 20000},
    {name: "Constituency E", voters: 60000, supporters: 40000},
];

const supportTrendData = [
    {month: "Jan", support: 30},
    {month: "Feb", support: 35},
    {month: "Mar", support: 40},
    {month: "Apr", support: 45},
    {month: "May", support: 50},
    {month: "Jun", support: 55},
];

export default function DashboardPage() {
    const [selectedConstituency, setSelectedConstituency] = useState("All");

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Button>Download Report</Button>
                </div>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Supporters
                                </CardTitle>
                                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">150,000</div>
                                <p className="text-xs text-muted-foreground">
                                    +2.5% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Voter Turnout (Last Election)
                                </CardTitle>
                                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">65%</div>
                                <p className="text-xs text-muted-foreground">
                                    +5% from previous election
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Campaign Events
                                </CardTitle>
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">25</div>
                                <p className="text-xs text-muted-foreground">
                                    This month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Approval Rating
                                </CardTitle>
                                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">58%</div>
                                <p className="text-xs text-muted-foreground">
                                    +7% from last poll
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Constituency Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ChartContainer
                                    config={{
                                        voters: {
                                            label: "Total Voters",
                                            color: "hsl(var(--chart-1))",
                                        },
                                        supporters: {
                                            label: "Your Supporters",
                                            color: "hsl(var(--chart-2))",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={constituencyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <ChartTooltip
                                                content={<ChartTooltipContent />}
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="voters"
                                                fill="var(--color-voters)"
                                            />
                                            <Bar
                                                dataKey="supporters"
                                                fill="var(--color-supporters)"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Support Trend</CardTitle>
                                <CardDescription>
                                    Monthly support trend over the last 6 months
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        support: {
                                            label: "Support Percentage",
                                            color: "hsl(var(--chart-3))",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={supportTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <ChartTooltip
                                                content={<ChartTooltipContent />}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="support"
                                                stroke="var(--color-support)"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <AnalyticsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
