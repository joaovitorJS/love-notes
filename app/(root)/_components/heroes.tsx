import Image from 'next/image'

export function Heroes() {
  return (
    <div className="flex flex-col items-center justify-center mx-w-5xl">
      <div className="flex items-start">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]">
          <Image
            src="/documents.png"
            width={500}
            height={500}
            alt="Documentos"
            className="obejct-contain"
          />
        </div>
        <div className="relative w-[300px] h-[300px] hidden md:block">
          <Image
            src="/reading.png"
            width={500}
            height={500}
            alt="Lendo"
            className="obejct-contain"
          />
        </div>
      </div>
    </div>
  )
}
