 import { Loader2Icon } from "lucide-react"
 import { Button } from "../ui/Button.jsx"
import { cn } from "@/lib/utils"

const ButtonLoading = ({type, text, loading, className, onClick, ...props }) => {
    return (
        <Button size="sm" 
        type ={type} 
        disabled ={loading}
        className={cn('', className)} 
        onClick={onClick} {...props}>
          {loading &&
            <Loader2Icon className="animate-spin" /> 
          }
          {text}
        </Button>
      )
}

export default ButtonLoading