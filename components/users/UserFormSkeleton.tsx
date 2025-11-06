export function UserFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Tipo de usuário */}
      <div>
        <div className="h-4 bg-[#2a2a2a] rounded w-32 mb-2"></div>
        <div className="h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md"></div>
      </div>

      {/* Nome e Telefone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="h-4 bg-[#2a2a2a] rounded w-20 mb-2"></div>
          <div className="h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md"></div>
        </div>
        <div>
          <div className="h-4 bg-[#2a2a2a] rounded w-24 mb-2"></div>
          <div className="h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md"></div>
        </div>
      </div>

      {/* Email */}
      <div>
        <div className="h-4 bg-[#2a2a2a] rounded w-16 mb-2"></div>
        <div className="h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#2a2a2a]">
        <div className="h-8 bg-[#2a2a2a] rounded w-40 mb-2"></div>
        <div className="h-8 bg-[#2a2a2a] rounded w-36 mb-2"></div>
      </div>

      {/* Campos adicionais */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="h-4 bg-[#2a2a2a] rounded w-16 mb-2"></div>
            <div className="h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md"></div>
          </div>
          <div>
            <div className="h-4 bg-[#2a2a2a] rounded w-12 mb-2"></div>
            <div className="h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="h-4 bg-[#2a2a2a] rounded w-12 mb-2"></div>
            <div className="h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md"></div>
          </div>
          <div>
            <div className="h-4 bg-[#2a2a2a] rounded w-20 mb-2"></div>
            <div className="h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md"></div>
          </div>
        </div>

        <div>
          <div className="h-4 bg-[#2a2a2a] rounded w-24 mb-2"></div>
          <div className="h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md"></div>
        </div>

        <div>
          <div className="h-4 bg-[#2a2a2a] rounded w-32 mb-2"></div>
          <div className="h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md"></div>
        </div>
      </div>
    </div>
  )
}
