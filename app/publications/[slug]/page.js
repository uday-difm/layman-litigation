import { publications } from "@/data/publications";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function PublicationPage({
    params,
}) {
    const { slug } = await params;
    const publication = publications.find(
        (item) => item.slug === slug
    );

    if (!publication) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {/* Hero Image */}
            <div className="relative h-[500px]">
                {/* <Image
                    src={publication.image}
                    alt={publication.title}
                    fill
                    className="object-cover"
                    alteer="Some image"
                /> */}

                <div className="absolute inset-0 bg-black/50" />

                <div className="absolute bottom-10 left-10">
                    <span
                        className="rounded px-3 py-1 text-black font-semibold"
                        style={{ backgroundColor: publication.accent }}
                    >
                        {publication.issue}
                    </span>

                    <h1 className="mt-4 text-5xl font-bold">
                        {publication.title}
                    </h1>

                    <p className="mt-3 text-xl text-white/80">
                        {publication.subtitle}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl px-6 py-16">
                <p className="mb-6 text-sm uppercase tracking-widest text-white/50">
                    {publication.month}
                </p>

                <div className="prose prose-invert max-w-none">
                    {publication.description
                        .split("\n\n")
                        .map((paragraph, index) => (
                            <p key={index} className="mb-6 text-lg leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                </div>
            </div>
        </div>
    );
}