import { watchEffect } from 'vue';
import { site } from '@/data/site';

const brand = site.brand;
const defaultDescription = `${site.brandZh}：记录技术学习、项目构建、问题排查与 Agent 工作流。`;

function setMeta(selector, attribute, content) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute(attribute, content);
}

export function usePageMeta(source) {
  watchEffect(() => {
    const meta = typeof source === 'function' ? source() : source;
    if (!meta) return;

    const title = meta.title ? `${meta.title} — ${brand}` : `${brand} — ${site.brandZh}`;
    const description = meta.description || defaultDescription;

    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
  });
}
