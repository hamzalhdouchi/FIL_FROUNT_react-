    import React, { useEffect, useState } from 'react';
    import axios from 'axios';

    const RestaurantHistory = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/restaurant-logs') 
        .then(response => setLogs(response.data))
        .catch(error => console.error('Error fetching logs:', error));
    }, []);

    const iconMap = {
        created: { icon: 'bx-plus', color: 'bg-green-100', text: 'text-green-600' },
        updated: { icon: 'bx-edit', color: 'bg-blue-100', text: 'text-blue-600' },
        deleted: { icon: 'bx-trash', color: 'bg-red-100', text: 'text-red-600' },
        status:  { icon: 'bx-time', color: 'bg-yellow-100', text: 'text-yellow-600' },
    };

    return (
        <section id="history" className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">تاريخ المطاعم</h3>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-8">
                {logs.map((log, index) => {
                const iconInfo = iconMap[log.event_type] || iconMap.updated;

                return (
                    <div key={index} className="flex">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconInfo.color} flex items-center justify-center z-10 border-2 border-white`}>
                        <i className={`bx ${iconInfo.icon} ${iconInfo.text}`}></i>
                    </div>
                    <div className="ml-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                            <h5 className="font-medium text-gray-800">{log.event_type.toUpperCase()}</h5>
                            <p className="text-gray-600 text-sm mt-1">{log.description}</p>
                            </div>
                            <span className="text-gray-500 text-xs">
                            {new Date(log.performed_at).toLocaleString()}
                            </span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <i className='bx bx-user text-gray-600 text-sm'></i>
                            </div>
                            <span className="ml-2 text-sm text-gray-700">بواسطة: {log.performed_by}</span>
                        </div>
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>
            </div>
        </div>
        </section>
    );
    };

    export default RestaurantHistory;
