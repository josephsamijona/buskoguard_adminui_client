// src/components/analytics/MonthlyReport.jsx
import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar as  TrendingUp,  Users } from 'lucide-react';
import attendanceAnalyticsService from '@/services/attendanceAnalytics.service';

const MonthlyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyData();
  }, [selectedDate, selectedDepartment]);

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);
      const response = await attendanceAnalyticsService.getMonthlyReport({
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        department: selectedDepartment
      });
      setData(response);
    } catch (error) {
      toast.error('Erreur lors du chargement des données mensuelles');
    } finally {
      setLoading(false);
    }
  };

  const bestAttendanceColumns = [
    {
      accessorKey: "full_name",
      header: "Employé",
    },
    {
      accessorKey: "department_name",
      header: "Département",
    },
    {
      accessorKey: "attendance_stats.attendance_rate",
      header: "Taux de présence",
      cell: ({ row }) => {
        const rate = row.original.attendance_stats.attendance_rate;
        return (
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${rate >= 90 ? 'bg-green-500' : rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            {rate}%
          </div>
        );
      },
    },
    {
      accessorKey: "attendance_stats.total_work_hours",
      header: "Heures travaillées",
    },
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
      {/* En-tête et filtres */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rapport Mensuel</h2>
          <p className="text-gray-500">
            {format(selectedDate, 'MMMM yyyy', { locale: fr })}
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tous les départements" />
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
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Sélectionner le mois
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de présence moyen
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.average_attendance_rate}%</div>
            <p className="text-xs text-gray-500">
              +2.1% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des heures travaillées
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total_work_hours}</div>
            <p className="text-xs text-gray-500">
              {data?.work_hours_comparison}% vs. mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Absences
            </CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total_absences}</div>
            <p className="text-xs text-gray-500">
              {data?.absence_rate}% du temps total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des tendances */}
      <Card>
        <CardHeader>
          <CardTitle>Tendances de présence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.daily_stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'dd MMM')} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy')}
                  formatter={(value) => [`${value}%`, 'Taux de présence']}
                />
                <Legend />
                <Bar dataKey="attendance_rate" fill="#3B82F6" name="Taux de présence" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Meilleurs taux de présence */}
      <Card>
        <CardHeader>
          <CardTitle>Meilleurs taux de présence</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={bestAttendanceColumns}
            data={data?.best_attendance || []}
          />
        </CardContent>
      </Card>

      {/* Département le plus performant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.department_breakdown?.map((dept) => (
          <Card key={dept.department}>
            <CardHeader>
              <CardTitle className="text-lg">{dept.department}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Taux de présence moyen:</span>
                  <span className="font-bold">{dept.average_attendance}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total heures travaillées:</span>
                  <span className="font-bold">{dept.total_hours}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${dept.average_attendance}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MonthlyReport;