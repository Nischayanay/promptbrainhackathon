import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Tables } from '../types/supabase'

type Prompt = Tables<'prompts'>
type UserCredit = Tables<'user_credits'>

export function DatabaseManager() {
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [credits, setCredits] = useState<UserCredit[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [promptsRes, creditsRes] = await Promise.all([
                supabase.from('prompts').select('*').limit(10),
                supabase.from('user_credits').select('*').limit(10)
            ])

            if (promptsRes.data) setPrompts(promptsRes.data)
            if (creditsRes.data) setCredits(creditsRes.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading database...</div>

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Database Manager</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prompts Table */}
                <div className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Prompts ({prompts.length})</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {prompts.map((prompt) => (
                            <div key={prompt.id} className="border-b pb-2">
                                <p className="font-medium">{prompt.title}</p>
                                <p className="text-sm text-gray-600">{prompt.enhancement_type}</p>
                                <p className="text-xs text-gray-500">{prompt.created_at}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Credits Table */}
                <div className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">User Credits ({credits.length})</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {credits.map((credit) => (
                            <div key={credit.id} className="border-b pb-2">
                                <p className="font-medium">Credits: {credit.credits_remaining}/{credit.credits_total}</p>
                                <p className="text-sm text-gray-600">User: {credit.user_id}</p>
                                <p className="text-xs text-gray-500">{credit.updated_at}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Refresh Data
            </button>
        </div>
    )
}