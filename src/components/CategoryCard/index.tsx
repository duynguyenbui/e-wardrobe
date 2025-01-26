import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Guitar } from 'lucide-react'

interface CategoryCardProps {
  title: string
  description?: string
}

export function CategoryCard({ title, description }: CategoryCardProps) {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-2">
        <div className="bg-primary/10 p-2 rounded-md">
          <Guitar className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
