import { notFound } from 'next/navigation';
import { getArticle, getNews } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SocialShare } from '@/components/article/social-share';
import { ArticleImageGallery } from '@/components/article/article-image-gallery';

interface ArticlePageProps {
    params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { id } = await params;

    // Fetch full article data
    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    // Fetch related articles from same category
    const relatedArticles = await getNews(article.category);
    const filteredRelated = relatedArticles
        .filter(a => a.id !== article.id)
        .slice(0, 3);

    // Calculate reading time (assuming 200 words per minute)
    const content = article.fullText || article.description;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / 200);

    const formattedDate = formatDistanceToNow(new Date(article.publishedAt), {
        addSuffix: true,
    });

    // Split content into paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim().length > 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Back Button */}
                <Link href="/">
                    <Button variant="ghost" className="mb-6 group hover:bg-white/50 dark:hover:bg-slate-800/50 backdrop-blur-sm">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Button>
                </Link>

                {/* Article Container */}
                <article className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                    {/* Hero Image with Gradient Overlay */}
                    {article.imageUrl && (
                        <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px]">
                            <Image
                                src={article.imageUrl}
                                alt={article.imageHint || article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Category Badge on Image */}
                            <div className="absolute top-6 left-6">
                                <span className="inline-block px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                                    {article.category}
                                </span>
                            </div>

                            {/* Title Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
                                    {article.title}
                                </h1>
                            </div>
                        </div>
                    )}

                    {/* Article Meta Information */}
                    <div className="px-8 md:px-12 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-medium">{readingTime} min read</span>
                            </div>

                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="px-8 md:px-12 py-10">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {paragraphs.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className={`text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-6 ${index === 0 ? 'first-letter:text-7xl first-letter:font-bold first-letter:text-blue-600 dark:first-letter:text-blue-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:mt-1' : ''
                                        }`}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Image Gallery */}
                        {article.images && article.images.length > 0 && (
                            <ArticleImageGallery images={article.images} />
                        )}

                        {/* Decorative Divider */}
                        <div className="my-10 flex items-center justify-center">
                            <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                        </div>


                    </div>

                    {/* Social Sharing */}
                    <div className="px-8 md:px-12 pb-10 border-t border-slate-200 dark:border-slate-700 pt-8">
                        <SocialShare title={article.title} articleId={article.id} />
                    </div>
                </article>

                {/* Related Articles */}
                {filteredRelated.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Related Articles
                            </h2>
                            <div className="flex-1 h-1 bg-gradient-to-r from-blue-600/50 to-transparent rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {filteredRelated.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/article/${related.id}`}
                                    className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50"
                                >
                                    {related.imageUrl && (
                                        <div className="relative w-full h-48">
                                            <Image
                                                src={related.imageUrl}
                                                alt={related.imageHint || related.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full mb-3">
                                            {related.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                            {related.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {related.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
