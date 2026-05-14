import { useEffect, useMemo, useState } from 'react';
import FeedbackState from '../../components/FeedbackState';
import { listResource } from '../../services/resourceApi';
import type { NewsItem } from '../../types';
import '../../styles/pages/public/NewsPage.css';

function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listResource<NewsItem>('news')
      .then(setNews)
      .catch((err: any) => setError(err.response?.data?.message || 'Cannot load news.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredNews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return news.filter((item) => {
      const matchesQuery = [item.title, item.content, item.type]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      const matchesType = type === 'ALL' || item.type === type;
      return matchesQuery && matchesType;
    });
  }, [news, query, type]);

  return (
    <FeedbackState loading={loading} error={error}>
      <section className="content-panel news-page">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Tournament media</p>
            <h1>News and Announcements</h1>
          </div>
        </div>

        <div className="filter-bar">
          <label>
            <span>Search news</span>
            <input value={query} placeholder="Title or content..." onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label>
            <span>Type</span>
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="ALL">ALL</option>
              <option value="NEWS">NEWS</option>
              <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
            </select>
          </label>
        </div>

        <FeedbackState empty={filteredNews.length === 0} emptyMessage="No news matches your filters.">
          <div className="news-list">
            {filteredNews.map((item) => (
              <article className="news-card" key={item.id}>
                <span>{item.type}</span>
                <h2>{item.title}</h2>
                <p>{item.content}</p>
              </article>
            ))}
          </div>
        </FeedbackState>
      </section>
    </FeedbackState>
  );
}

export default NewsPage;
