import { useEffect, useState } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import { useAuthStore } from "../store/useAuthStore";
import { Loader, User, MessageSquare, Activity, Users, BarChart2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { dashboardStats, onlineUsers, getDashboardStats, getOnlineUsers, isLoading } = useDashboardStore();
  const { authUser, socket } = useAuthStore();
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  useEffect(() => {
    // Charger les données initiales
    getDashboardStats();
    getOnlineUsers();

    // Configurer l'écouteur d'événements socket pour les mises à jour du dashboard
    if (socket) {
      socket.on("dashboardUpdate", (data) => {
        // Mettre à jour les données du dashboard quand un nouvel événement est reçu
        getDashboardStats();
        getOnlineUsers();
        setLastUpdateTime(new Date());
      });

      // Écouter les mises à jour des utilisateurs en ligne
      socket.on("getOnlineUsers", () => {
        getOnlineUsers();
        setLastUpdateTime(new Date());
      });
    }

    // Rafraîchir les statistiques toutes les 30 secondes
    const interval = setInterval(() => {
      getDashboardStats();
      getOnlineUsers();
      setLastUpdateTime(new Date());
    }, 30000);

    return () => {
      // Nettoyer les écouteurs d'événements lors du démontage du composant
      if (socket) {
        socket.off("dashboardUpdate");
        socket.off("getOnlineUsers");
      }
      clearInterval(interval);
    };
  }, [getDashboardStats, getOnlineUsers, socket]);

  if (isLoading || !dashboardStats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] mt-16">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // Formater les données pour le graphique
  const chartData = dashboardStats.messagesPerDay.map(item => ({
    date: item._id,
    messages: item.count
  }));

  // Formatage de l'heure de dernière mise à jour
  const formattedUpdateTime = lastUpdateTime.toLocaleTimeString();

  return (
    <div className="min-h-screen bg-base-200 pt-20 px-4 pb-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <BarChart2 className="mr-2" /> Dashboard
          </h1>
          <div className="text-sm opacity-70">
            Dernière mise à jour : {formattedUpdateTime}
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Utilisateur le plus sollicité */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-sm font-semibold flex items-center">
                <User className="size-4 mr-2 text-primary" /> Utilisateur le plus sollicité
              </h2>
              {dashboardStats.mostContactedUser.user ? (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="avatar mr-3">
                      <div className="w-10 h-10 rounded-full">
                        {dashboardStats.mostContactedUser.user.profilePic ? (
                          <img src={dashboardStats.mostContactedUser.user.profilePic} alt="Profile" />
                        ) : (
                          <div className="bg-primary/10 w-full h-full flex items-center justify-center">
                            <User className="size-5 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{dashboardStats.mostContactedUser.user.fullName}</p>
                      <p className="text-xs opacity-70">{dashboardStats.mostContactedUser.messageCount} messages reçus</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm opacity-70">Aucune donnée disponible</p>
              )}
            </div>
          </div>

          {/* Utilisateur qui communique le plus */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-sm font-semibold flex items-center">
                <MessageSquare className="size-4 mr-2 text-primary" /> Utilisateur le plus actif
              </h2>
              {dashboardStats.mostActiveUser.user ? (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="avatar mr-3">
                      <div className="w-10 h-10 rounded-full">
                        {dashboardStats.mostActiveUser.user.profilePic ? (
                          <img src={dashboardStats.mostActiveUser.user.profilePic} alt="Profile" />
                        ) : (
                          <div className="bg-primary/10 w-full h-full flex items-center justify-center">
                            <User className="size-5 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{dashboardStats.mostActiveUser.user.fullName}</p>
                      <p className="text-xs opacity-70">{dashboardStats.mostActiveUser.messageCount} messages envoyés</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm opacity-70">Aucune donnée disponible</p>
              )}
            </div>
          </div>

          {/* Nombre total de messages */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-sm font-semibold flex items-center">
                <Activity className="size-4 mr-2 text-primary" /> Statistiques générales
              </h2>
              <div className="mt-2">
                <p className="text-lg font-bold">{dashboardStats.totalMessages}</p>
                <p className="text-xs opacity-70">Messages totaux</p>
                
                <div className="divider my-2"></div>
                
                <p className="text-lg font-bold">{dashboardStats.totalUsers}</p>
                <p className="text-xs opacity-70">Utilisateurs inscrits</p>
              </div>
            </div>
          </div>

          {/* Moyenne de messages par utilisateur */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-sm font-semibold flex items-center">
                <MessageSquare className="size-4 mr-2 text-primary" /> Engagement
              </h2>
              <div className="mt-2">
                <p className="text-lg font-bold">{dashboardStats.averageMessagesPerUser}</p>
                <p className="text-xs opacity-70">Messages par utilisateur (moyenne)</p>
                
                <div className="divider my-2"></div>
                
                <p className="text-lg font-bold">{onlineUsers.length}</p>
                <p className="text-xs opacity-70">Utilisateurs en ligne actuellement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique d'activité */}
        <div className="card bg-base-100 shadow-md mb-8">
          <div className="card-body">
            <h2 className="card-title text-sm font-semibold flex items-center mb-4">
              <Activity className="size-4 mr-2 text-primary" /> Activité des 7 derniers jours
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="messages" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs en ligne */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-sm font-semibold flex items-center">
              <Users className="size-4 mr-2 text-primary" /> Utilisateurs en ligne ({onlineUsers.length})
            </h2>
            <div className="overflow-x-auto">
              {onlineUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {onlineUsers.map((user) => (
                    <div key={user._id} className="flex items-center p-2 rounded-lg border border-base-300">
                      <div className="avatar mr-3">
                        <div className="w-10 h-10 rounded-full">
                          {user.profilePic ? (
                            <img src={user.profilePic} alt="Profile" />
                          ) : (
                            <div className="bg-primary/10 w-full h-full flex items-center justify-center">
                              <User className="size-5 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs opacity-70">{user.email}</p>
                      </div>
                      <div className="ml-auto">
                        <div className="badge badge-success badge-sm">En ligne</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-70 mt-4">Aucun utilisateur en ligne actuellement</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;