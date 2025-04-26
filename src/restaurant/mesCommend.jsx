        import { useEffect, useState, useCallback, useMemo } from "react"
        import { useNavigate, useParams } from "react-router-dom"
        import Header from "./components/layout/header.jsx"
        import axios from "axios"
        import Swal from "sweetalert2"
        import dayjs from "dayjs"

        const API_BASE_URL = "http://127.0.0.1:8000/api"
        const STATUS_TYPES = {
        EN_ATTENTE: "en_attente",
        EN_COURS: "en_cours",
        TERMINEE: "terminee",
        ANNULEE: "annulee"
        }

        const CommandesPage = () => {
        const [activeTab, setActiveTab] = useState(STATUS_TYPES.EN_COURS)
        const [commandes, setCommandes] = useState({
            [STATUS_TYPES.EN_ATTENTE]: [],
            [STATUS_TYPES.EN_COURS]: [],
            [STATUS_TYPES.TERMINEE]: [],
            [STATUS_TYPES.ANNULEE]: [],
        })
        const [isLoading, setIsLoading] = useState(true)
        const { restaurant_id, table_id } = useParams()
        const [error, setError] = useState(null)
        const [paymentData, setPaymentData] = useState([])
        const [paymentMethod, setPaymentMethod] = useState(null)
        const navigate = useNavigate()

        const getStatusConfig = useMemo(() => (statut) => {
            const configs = {
            [STATUS_TYPES.EN_COURS]: {
                badgeClass: "bg-blue-100 text-blue-800",
                icon: "bx bx-loader-circle",
                label: "En préparation"
            },
            [STATUS_TYPES.EN_ATTENTE]: {
                badgeClass: "bg-yellow-100 text-yellow-800",
                icon: "bx bx-time",
                label: "En attente"
            },
            [STATUS_TYPES.ANNULEE]: {
                badgeClass: "bg-red-100 text-red-800",
                icon: "bx bx-x-circle",
                label: "Annulée"
            },
            [STATUS_TYPES.TERMINEE]: {
                badgeClass: "bg-green-100 text-green-800",
                icon: "bx bx-check-circle",
                label: "Terminée"
            },
            default: {
                badgeClass: "bg-gray-100 text-gray-800",
                icon: "bx bx-info-circle",
                label: statut
            }
            }
            return configs[statut] || configs.default
        }, [])

        // États vides
        const emptyStates = useMemo(() => ({
            [STATUS_TYPES.EN_ATTENTE]: {
            icon: "bx-time-five",
            title: "Aucune commande en attente",
            text: "Vous n'avez aucune commande en attente pour le moment.",
            },
            [STATUS_TYPES.EN_COURS]: {
            icon: "bx-loader-circle",
            title: "Aucune commande en cours",
            text: "Vous n'avez aucune commande en cours de préparation.",
            },
            [STATUS_TYPES.TERMINEE]: {
            icon: "bx-check-circle",
            title: "Aucune commande terminée",
            text: "Vous n'avez encore effectué aucune commande.",
            },
            [STATUS_TYPES.ANNULEE]: {
            icon: "bx-x-circle",
            title: "Aucune commande annulée",
            text: "Vous n'avez annulé aucune commande.",
            },
        }), [])

        const fetchCommandes = useCallback(async () => {
            setIsLoading(true)
            setError(null)
            
            try {
            const response = await axios.get(
                `${API_BASE_URL}/commandes/restaurant/${restaurant_id}/table/${table_id}`
            )

            const allCommandes = response.data.data 
            
            setCommandes({
                [STATUS_TYPES.EN_ATTENTE]: allCommandes.filter(cmd => cmd.statut === STATUS_TYPES.EN_ATTENTE),
                [STATUS_TYPES.EN_COURS]: allCommandes.filter(cmd => cmd.statut === STATUS_TYPES.EN_COURS),
                [STATUS_TYPES.TERMINEE]: allCommandes.filter(cmd => cmd.statut === STATUS_TYPES.TERMINEE),
                [STATUS_TYPES.ANNULEE]: allCommandes.filter(cmd => cmd.statut === STATUS_TYPES.ANNULEE),
            })
            } catch (error) {
            console.error("Error fetching commandes:", error)
            setError("Impossible de charger les commandes")
            } finally {
            setIsLoading(false)
            }
        }, [restaurant_id, table_id])

        const fetchPayments = useCallback(async () => {
            setIsLoading(true)
            setError(null)
            
            try {
            const response = await axios.get(`${API_BASE_URL}/payment`)
            setPaymentData(response.data.data || [])
            } catch (error) {
            console.error("Error fetching payments:", error)
            setError(error.response?.data?.message || "Impossible de charger les paiements")
            } finally {
            setIsLoading(false)
            }
        }, [])

        useEffect(() => {
            fetchCommandes()
            fetchPayments()
        }, [fetchCommandes, fetchPayments])

        const handleAction = useCallback(async (action, commande, additionalData = {}) => {
            try {
            let response
            const token = sessionStorage.getItem("token")
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

            switch (action) {
                case 'cancel':
                response = await axios.put(
                    `${API_BASE_URL}/commandes/statut/${commande.id}`,
                    { statut: STATUS_TYPES.ANNULEE },
                    config
                )
                break
                
                case 'evaluate':
                response = await axios.put(
                    `${API_BASE_URL}/commandes/${commande.id}/evaluation`,
                    { evaluation: additionalData.evaluation },
                    config
                )
                break
                
                case 'reorder':
                const newCommande = {
                    restaurant_id: commande.restaurant_id,
                    quantite: commande.quantite,
                    instructions: commande.instructions,
                    table_number: commande.table_number,
                    plats: commande.plat,
                    plat_id: commande.plat.id,
                    paymentStatus: "en_coure"
                }
                response = await axios.post(`${API_BASE_URL}/commandes`, newCommande, config)
                break
                
                case 'pay':
                const user = JSON.parse(sessionStorage.getItem('user'))
                const user_id = user?.id
                
                if (!token) {
                    const url = `http://localhost:3000/menu/${restaurant_id}/table/${table_id}`
                    sessionStorage.setItem('redirect_url', url)
                    navigate('/')
                    return
                }
                
                response = await axios.post(`${API_BASE_URL}/payment/pay`, {
                    amount: commande.prixTotal,
                    commande_id: commande.id,
                    user_id: user_id,
                    restaurant_id,
                    table_id,
                    payment_method: additionalData.method || 'online'
                }, config)
                
                if (response.data.success) {
                    window.location.href = response.data.redirect_url
                    return
                }
                break
                
                default:
                throw new Error("Action non reconnue")
            }

            await fetchCommandes()
            return response
            } catch (error) {
            console.error(`${action} error:`, error)
            throw error
            }
        }, [restaurant_id, table_id, navigate, fetchCommandes])

        const withConfirmation = async (action, commande, confirmationText, additionalData = {}) => {
            const result = await Swal.fire({
            title: confirmationText.title,
            text: confirmationText.message,
            icon: confirmationText.icon || "question",
            showCancelButton: true,
            confirmButtonColor: "#bd8c5e",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmationText.confirmText || "Confirmer",
            cancelButtonText: "Annuler",
            })

            if (!result.isConfirmed) return null

            try {
            const response = await handleAction(action, commande, additionalData)
            
            Swal.fire({
                icon: "success",
                title: confirmationText.successTitle,
                text: confirmationText.successText,
                showConfirmButton: false,
                timer: 1500,
            })
            
            return response
            } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: error.response?.data?.message || `Échec de l'action: ${action}`,
            })
            }
        }

        const handleCancel = (commandeId) => {
            const commande = [...commandes[STATUS_TYPES.EN_ATTENTE], ...commandes[STATUS_TYPES.EN_COURS]]
            .find(cmd => cmd.id === commandeId)
            
            if (!commande) return

            withConfirmation('cancel', commande, {
            title: "Confirmer l'annulation",
            message: "Voulez-vous vraiment annuler cette commande ?",
            icon: "warning",
            confirmText: "Oui, annuler",
            successTitle: "Commande annulée"
            })
        }

        const handleEvaluation = async (commandeId) => {
            const { value: evaluation } = await Swal.fire({
            title: "Évaluez votre commande",
            input: "range",
            inputAttributes: {
                min: "1",
                max: "5",
                step: "0.5",
            },
            inputValue: 5,
            showCancelButton: true,
            confirmButtonText: "Envoyer",
            confirmButtonColor: "#bd8c5e",
            cancelButtonText: "Annuler",
            })

            if (!evaluation) return

            const commande = commandes[STATUS_TYPES.TERMINEE].find(cmd => cmd.id === commandeId)
            if (!commande) return

            withConfirmation('evaluate', commande, {
            title: "Confirmer l'évaluation",
            successTitle: "Merci pour votre évaluation !",
            successText: `Vous avez donné une note de ${evaluation}/5`
            }, { evaluation })
        }

        const handleReorder = (commande) => {
            withConfirmation('reorder', commande, {
            title: "Commander à nouveau ?",
            message: `Souhaitez-vous passer la même commande chez ${commande.restaurant_name} ?`,
            successTitle: "Commande passée avec succès"
            })
        }

        const handlePayment = async (commandeId, method = 'online') => {
            const commande = commandes[STATUS_TYPES.EN_ATTENTE].find(c => c.id === commandeId)
            if (!commande) return

            try {
            await handleAction('pay', commande, { method })
            } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erreur de paiement",
                text: error.response?.data?.message || error.message,
            })
            }
        }

        const changePaymentMethod = async (commandeId) => {
            const result = await Swal.fire({
            title: "Changer la méthode de paiement",
            text: "Voulez-vous payer en espèces plutôt qu'en ligne ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#bd8c5e",
            confirmButtonText: "Oui, payer en espèces",
            cancelButtonText: "Non, payer en ligne",
            });
        
            setPaymentMethod((prev) => ({
            ...prev,
            [commandeId]: result.isConfirmed ? 'cash' : 'online',
            }));
        };

        const CommandeCard = ({ commande, type }) => {
            const isPaid = Array.isArray(paymentData) && paymentData.some(p => p.commande_id === commande.id);
            const statusConfig = getStatusConfig(commande.statut);
            const [localPaymentMethod, setLocalPaymentMethod] = useState(null);
        
            const handlePaymentSelection = () => {
            Swal.fire({
                title: "Choisissez votre méthode de paiement",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Payer en ligne",
                denyButtonText: "Payer en espèces",
                cancelButtonText: "Annuler",
                confirmButtonColor: "#bd8c5e",
                denyButtonColor: "#eab308", 
                cancelButtonColor: "#ef4444", 
                icon: "question"
            }).then((result) => {
                if (result.isConfirmed) {
                setLocalPaymentMethod('online');
                } else if (result.isDenied) {
                setLocalPaymentMethod('cash');
                }
            });
            };
        
            return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.01]">
                <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden">
                        
                    </div>
                    </div>
        
                    <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                        <div>
                        <h2 className="text-xl font-bold">{commande.restaurant_name}</h2>
                        <p className="text-gray-600">Commande #{commande.id}</p>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusConfig.badgeClass}`}>
                        <i className={`${statusConfig.icon} mr-2`}></i>
                        {statusConfig.label}
                        </div>
                    </div>
        
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                            {dayjs(commande.created_at).format("DD/MM/YYYY HH:mm")}
                        </p>
                        </div>
                        <div>
                        <p className="text-sm text-gray-500">Table</p>
                        <p className="font-medium">N° {commande.table_number}</p>
                        </div>
                        <div>
                        <p className="text-sm text-gray-500">Quantité</p>
                        <p className="font-medium">{commande.quantite} article(s)</p>
                        </div>
                    </div>
        
                    {commande.prixTotal && (
                        <div className="mb-4">
                        <p className="text-sm text-gray-500">Prix total</p>
                        <p className="font-medium">
                            {parseFloat(commande.prixTotal).toFixed(2)} €
                        </p>
                        </div>
                    )}
        
                    {commande.instructions && (
                        <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-800 mb-1">
                            Instructions spéciales
                        </h3>
                        <p className="text-gray-600">{commande.instructions}</p>
                        </div>
                    )}
        
                    {commande.evaluation && (
                        <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-800 mb-1">
                            Votre évaluation
                        </h3>
                        <div className="flex items-center">
                            <span className="text-yellow-500 mr-2">
                            {commande.evaluation}/5
                            </span>
                            <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                key={star}
                                className={`bx ${
                                    star <= commande.evaluation ? "bxs-star" : "bx-star"
                                } text-yellow-500`}
                                ></i>
                            ))}
                            </div>
                        </div>
                        </div>
                    )}
        
                    {localPaymentMethod === null ? (
                        <div className="flex flex-wrap gap-3">
                        {type === STATUS_TYPES.EN_ATTENTE && (
                            <div className="flex gap-2">
                            {isPaid ? (
                                <span className="border border-green-600 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                <i className="bx bx-check-circle text-green-600 text-lg"></i>
                                Payé
                                </span>
                            ) : (
                                <>
                                <button
                                    onClick={() => handleCancel(commande.id)}
                                    className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                                >
                                    <i className="bx bx-x mr-2"></i>
                                    Annuler
                                </button>
                                <button
                                    onClick={handlePaymentSelection}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <i className="bx bx-credit-card text-white text-lg"></i>
                                    Choisir paiement
                                </button>
                                </>
                            )}
                            </div>
                        )}
        
                        {type === STATUS_TYPES.TERMINEE && !commande.evaluation && (
                            <button
                            onClick={() => handleEvaluation(commande.id)}
                            className="bg-wood-500 hover:bg-wood-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                            <i className="bx bx-star mr-2"></i>
                            Évaluer
                            </button>
                        )}
        
                        {(type === STATUS_TYPES.TERMINEE || type === STATUS_TYPES.ANNULEE) && (
                            <button
                            onClick={() => handleReorder(commande)}
                            className="bg-wood-500 hover:bg-wood-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                            <i className="bx bx-refresh mr-2"></i>
                            Commander à nouveau
                            </button>
                        )}
                        </div>
                    ) : (
                        <div className="flex gap-2">
                        <button
                            onClick={() => handlePayment(commande.id, localPaymentMethod)}
                            className={`${
                            localPaymentMethod === 'cash'
                                ? 'bg-yellow-500 hover:bg-yellow-600'
                                : 'bg-wood-500 hover:bg-wood-600'
                            } text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 flex-1`}
                        >
                            <i className="bx bx-credit-card text-white text-lg"></i>
                            {localPaymentMethod === 'cash' ? 'Payer en espèces' : 'Payer en ligne'}
                        </button>
                        <button
                            onClick={() => setLocalPaymentMethod(null)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                        >
                            <i className="bx bx-undo mr-1"></i>
                        </button>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            </div>
            );
        };

        const renderTabContent = () => {
            if (isLoading) {
            return (
                <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wood-500"></div>
                </div>
            )
            }

            if (error) {
            return (
                <div className="text-center py-12">
                <i className="bx bx-error text-5xl text-red-400 mb-4"></i>
                <h3 className="text-xl font-medium text-gray-700">Erreur de chargement</h3>
                <p className="text-gray-500 mt-2">{error}</p>
                <button
                    onClick={() => {
                    fetchCommandes()
                    fetchPayments()
                    }}
                    className="mt-4 inline-block bg-wood-500 hover:bg-wood-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Réessayer
                </button>
                </div>
            )
            }

            const currentCommandes = commandes[activeTab]

            if (currentCommandes.length === 0) {
            const { icon, title, text } = emptyStates[activeTab]
            return (
                <div className="text-center py-12">
                <i className={`bx ${icon} text-5xl text-gray-400 mb-4`}></i>
                <h3 className="text-xl font-medium text-gray-700">{title}</h3>
                <p className="text-gray-500 mt-2">{text}</p>
                </div>
            )
            }

            return (
            <div className="space-y-6">
                {currentCommandes.map((commande) => (
                <CommandeCard key={commande.id} commande={commande} type={activeTab} />
                ))}
            </div>
            )
        }

        const tabs = useMemo(() => [
            { id: STATUS_TYPES.EN_COURS, label: "En cours" },
            { id: STATUS_TYPES.EN_ATTENTE, label: "En attente" },
            { id: STATUS_TYPES.TERMINEE, label: "Terminées" },
            { id: STATUS_TYPES.ANNULEE, label: "Annulées" },
        ], [])

        return (
            <div className="min-h-screen bg-gray-50">
            <Header />

            <header className="bg-white border-b border-gray-200 py-8">
                <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
                <p className="text-gray-600 mt-2">
                    Suivez vos commandes en cours et consultez votre historique
                </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                        setActiveTab(tab.id)
                        setPaymentMethod(null) 
                        }}
                        className={`py-4 px-1 border-b-2 font-medium ${
                        activeTab === tab.id
                            ? "border-wood-500 text-wood-700"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                    ))}
                </nav>
                </div>

                {renderTabContent()}
            </main>
            </div>
        )
        }

        export default CommandesPage