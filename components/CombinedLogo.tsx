import { LogoIcon as OpenFrontIcon } from "./LogoIcon-openfront"
import { LogoIcon as OpenShipIcon } from "./LogoIcon"
import { OpensupportLogoIcon as OpenSupportIcon } from "./OpensupportLogoIcon"

interface CombinedLogoProps {
  className?: string
}

export function CombinedLogo({ className = "" }: CombinedLogoProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <OpenFrontIcon className="size-6" />
      <OpenShipIcon className="size-6" />
      <OpenSupportIcon className="size-6" />
    </div>
  )
}