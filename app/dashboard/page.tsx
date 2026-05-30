"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  UserRoundPlus, Search, Stethoscope, Pill, Activity, Microscope,
  ArrowRight, Users, HeartPulse, Building2
} from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconTrendingUp } from "@tabler/icons-react"
import { getDashboardSummary, getPatientList } from "@/lib/api"
import { useState } from "react"


const quickActions = [
  {
    title: "Create Patient",
    description: "Register a new patient in the system",
    icon: UserRoundPlus,
    href: "/dashboard/create-patient",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Search Patient",
    description: "Look up a patient by phone number",
    icon: Search,
    href: "/dashboard/patients",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  {
    title: "Manage Doctors",
    description: "View and add hospital doctors",
    icon: Stethoscope,
    href: "/dashboard/doctors",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
  },
  {
    title: "Medications",
    description: "Browse and add medicines",
    icon: Pill,
    href: "/dashboard/medications",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    title: "Diseases",
    description: "Manage disease registry",
    icon: Microscope,
    href: "/dashboard/diseases",
    color: "text-rose-600",
    bg: "bg-rose-500/10",
  },
]

export default function DashboardPage() {
  const router = useRouter()

const [activeTab, setActiveTab] = useState("all")
const [allPage, setAllPage] = useState(1)

const { data, isLoading } = useQuery({
  queryKey: ["dashboardSummary"],
  queryFn: getDashboardSummary,
})
const summary = data?.data

const allPatientsQuery = useQuery({
  queryKey: ["patients-all", allPage],
  queryFn: () => getPatientList(allPage, 10),
})

const allPatientsFilterQuery = useQuery({
  queryKey: ["patients-filter"],
  queryFn: () => getPatientList(1, 100),
})

const allPatients = allPatientsQuery.data?.data?.patients || []
const pagination = allPatientsQuery.data?.data?.pagination
const allPatientsForFilter = allPatientsFilterQuery.data?.data?.patients || []
const highRiskPatients = allPatientsForFilter.filter((p: any) =>
  p.conditions?.some((c: any) => c.status === "CRITICAL")
)
const activePatients = allPatientsForFilter.filter((p: any) =>
  p.conditions?.some((c: any) => !c.endDate)
)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> Total Patients
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  —
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">Registered patients in system</div>
              </CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription className="flex items-center gap-1.5">
                  <HeartPulse className="h-4 w-4" /> Active Conditions
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  —
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">Ongoing patient conditions</div>
              </CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription className="flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4" /> Doctors
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  —
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">Hospital doctors on staff</div>
              </CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription className="flex items-center gap-1.5">
                  <Pill className="h-4 w-4" /> Medications
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  —
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">Medicines in formulary</div>
              </CardFooter>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => router.push(action.href)}
                  className="group relative flex flex-col items-start gap-3 rounded-xl border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${action.bg}`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                  </div>
                  <ArrowRight className="absolute right-4 top-5 h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              ))}
            </div>
         </div>

          {/* Patient List */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Patient List</h2>
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b">
                {[
                  { key: "all", label: "All Patients" },
                  { key: "active", label: `Active (${activePatients.length})` },
                  { key: "high-risk", label: `High Risk (${highRiskPatients.length})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Name</th>
                      <th className="text-left px-4 py-3 font-medium">Mobile</th>
                      <th className="text-left px-4 py-3 font-medium">Blood Group</th>
                      <th className="text-left px-4 py-3 font-medium">Gender</th>
                      <th className="text-left px-4 py-3 font-medium">Conditions</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(activeTab === "all" ? allPatients : activeTab === "active" ? activePatients : highRiskPatients).map((p: any) => (
                      <tr
                        key={p.id}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => router.push(`/dashboard/patients?mobile=${p.mobileNumber}`)}
                      >
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.mobileNumber}</td>
                        <td className="px-4 py-3">{p.bloodGroup}</td>
                        <td className="px-4 py-3">{p.gender}</td>
                        <td className="px-4 py-3">{p.conditions?.length || 0}</td>
                        <td className="px-4 py-3">
                          {p.conditions?.some((c: any) => c.status === "CRITICAL") ? (
                            <span className="inline-flex items-center rounded-full bg-red-500/15 text-red-700 border border-red-500/30 px-2.5 py-0.5 text-xs font-semibold">High Risk</span>
                          ) : p.conditions?.some((c: any) => !c.endDate) ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold">Active</span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-500/15 text-gray-700 border border-gray-500/30 px-2.5 py-0.5 text-xs font-semibold">Stable</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(activeTab === "all" ? allPatientsQuery.isLoading : allPatientsFilterQuery.isLoading) && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
                    )}
                    {(activeTab === "all" ? allPatients : activeTab === "active" ? activePatients : highRiskPatients).length === 0 && !allPatientsQuery.isLoading && !allPatientsFilterQuery.isLoading && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No patients found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination — only for All tab */}
              {activeTab === "all" && pagination && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} patients
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAllPage(p => Math.max(1, p - 1))}
                      disabled={pagination.page === 1}
                      className="px-3 py-1.5 text-sm rounded-lg border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setAllPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1.5 text-sm rounded-lg border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
