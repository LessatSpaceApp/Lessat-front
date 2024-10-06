import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

type TeamMember = {
  id: number
  name: string
  role: string
  image: string
}

const teamMembers: TeamMember[] = [
  { id: 1, name: "Mauricio Caceres", role: "Developer", image: "/Mauri.png?height=400&width=300" },
  { id: 2, name: "Sofia Rojas", role: "Designer", image: "/Sofi.png?height=400&width=300" },
  { id: 3, name: "Nahuel Quiroga", role: "Developer", image: "/Nahue.png?height=400&width=300" },
  { id: 4, name: "Francesco Gentile", role: "Developer", image: "/Fran.png?height=400&width=300" },
  { id: 5, name: "Antonella Bertona", role: "Comunication", image: "/Anto.png?height=400&width=300" },
  { id: 6, name: "Carlos Bustillo", role: "Developer", image: "/Carlos.png?height=400&width=300" },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <header className="bg-[#F7B5CD] text-black py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Lessat Team</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="bg-transparent overflow-hidden group">
              <CardContent className="p-0 relative">
                <div className="overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h2 className="text-2xl font-bold mb-2 text-white">{member.name}</h2>
                  <Badge variant="secondary" className="bg-[#F7B5CD] text-black">
                    {member.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}