import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CloudLightningIcon } from 'lucide-react'

interface MaterialCardProps {
  title: string
  description?: string
}

export function MaterialCard({ title, description }: MaterialCardProps) {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-2">
        <div className="bg-primary/10 p-2 rounded-md">
          <CloudLightningIcon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
