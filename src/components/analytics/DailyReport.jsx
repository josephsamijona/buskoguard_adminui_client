// src/components/analytics/DailyReport.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users, Clock, Ban, CalendarDays, Search, Download } from 'lucide-react';

// Ce composant reçoit un objet data en props
const QuickStats = ({ data }) => {
  const stats = [
    {
      title: "Total Employés",
      value: data.total_employees,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Présents",
      value: data.present,
      percentage: (data.present / data.total_employees * 100).toFixed(1),
      icon: Clock,
      color: "bg-green-500"
    },
    {
      title: "Retards",
      value: data.late,
      percentage: (data.late / data.total_employees * 100).toFixed(1),
      icon: Clock,
      color: "bg-yellow-500"
    },
    {
      title: "Absents",
      value: data.absent,
      percentage: (data.absent / data.total_employees * 100).toFixed(1),
      icon: Ban,
      color: "bg-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                {stat.percentage && (
                  <p className="text-sm text-gray-600 mt-1">{stat.percentage}%</p>
                )}
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

QuickStats.propTypes = {
  data: PropTypes.shape({
    total_employees: PropTypes.number.isRequired,
    present: PropTypes.number.isRequired,
    late: PropTypes.number.isRequired,
    absent: PropTypes.number.isRequired
  }).isRequired
};

const DailyReport = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les données initiales
    fetchData();
  }, [date, selectedDepartment, selectedStatus, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Assurez-vous que attendanceAnalyticsService et toast sont définis et importés
      const response = await attendanceAnalyticsService.getDailyReport({
        date: format(date, 'yyyy-MM-dd'),
        department: selectedDepartment,
        status: selectedStatus,
        search: search
      });
      setData(response);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "employee_name",
      header: "Employé"
    },
    {
      accessorKey: "department_name",
      header: "Département"
    },
    {
      accessorKey: "check_in_time",
      header: "Arrivée"
    },
    {
      accessorKey: "check_out_time",
      header: "Départ"
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const colors = {
          PRESENT: "bg-green-100 text-green-800",
          LATE: "bg-yellow-100 text-yellow-800",
          ABSENT: "bg-red-100 text-red-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
            {status}
          </span>
        );
      }
    },
    {
      accessorKey: "work_duration",
      header: "Durée"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher un employé..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Département" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les départements</SelectItem>
            {data?.departments?.map(dept => (
              <SelectItem key={dept.id} value={dept.id.toString()}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="PRESENT">Présent</SelectItem>
            <SelectItem value="LATE">En retard</SelectItem>
            <SelectItem value="ABSENT">Absent</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {format(date, 'dd MMMM yyyy', { locale: fr })}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      {data?.summary && <QuickStats data={data.summary} />}

      {/* Données détaillées */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="departments">Par département</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Taux de présence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.daily_trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="present" stroke="#10B981" name="Présents" />
                    <Line type="monotone" dataKey="late" stroke="#FBBF24" name="Retards" />
                    <Line type="monotone" dataKey="absent" stroke="#EF4444" name="Absents" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          {data?.department_breakdown && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.department_breakdown.map((dept) => (
                <Card key={dept.id}>
                  <CardHeader>
                    <CardTitle>{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total employés:</span>
                        <span>{dept.total_employees}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Présents:</span>
                          <span className="text-green-600">{dept.present_count}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Retards:</span>
                          <span className="text-yellow-600">{dept.late_count}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Absents:</span>
                          <span className="text-red-600">{dept.absent_count}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${dept.attendance_rate}%` }}
                        />
                      </div>
                      <div className="text-sm text-right">
                        Taux de présence: {dept.attendance_rate}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="details">
          {data?.attendance_details && (
            <DataTable
              columns={columns}
              data={data.attendance_details}
              pagination
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyReport;
