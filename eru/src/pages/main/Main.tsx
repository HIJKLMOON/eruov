import styles from "./Main.module.css";

const features = [
  { title: "计数器", desc: "简单的数字累加功能", icon: "01" },
  { title: "API 请求", desc: "演示 HTTP 请求的发送与处理", icon: "02" },
  { title: "数据存储", desc: "LocalStorage 数据持久化", icon: "03" },
  { title: "用户认证", desc: "完整的登录注册流程", icon: "04" },
];

const stats = [
  { value: "4+", label: "核心功能" },
  { value: "100%", label: "开源可用" },
  { value: "React", label: "技术栈" },
];

const Main = () => {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.titleWrapper}>
            <div className={styles.line} />
            <h1 className={styles.title}>ERU</h1>
            <div className={styles.line} />
          </div>
          <p className={styles.subtitle}>一个现代 Web 应用演示项目</p>
          <p className={styles.description}>
            基于 React + TypeScript 构建 <br />
            展示常见 Web 开发模式与最佳实践
          </p>
        </div>
        <div className={styles.heroGraphic}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <line
              x1="20"
              y1="20"
              x2="180"
              y2="20"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="40"
              x2="180"
              y2="40"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="60"
              x2="180"
              y2="60"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="80"
              x2="180"
              y2="80"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="100"
              x2="180"
              y2="100"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="120"
              x2="180"
              y2="120"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="140"
              x2="180"
              y2="140"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="160"
              x2="180"
              y2="160"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="180"
              x2="180"
              y2="180"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="20"
              x2="20"
              y2="180"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="20"
              x2="60"
              y2="180"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="100"
              y1="20"
              x2="100"
              y2="180"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="140"
              y1="20"
              x2="140"
              y2="180"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="180"
              y1="20"
              x2="180"
              y2="180"
              stroke="#333"
              strokeWidth="1"
            />
            <rect
              x="70"
              y="50"
              width="40"
              height="40"
              stroke="#333"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="90"
              cy="70"
              r="15"
              stroke="#333"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.sectionHeader}>
          <div className={styles.lineShort} />
          <h2 className={styles.sectionTitle}>关于项目</h2>
          <div className={styles.lineShort} />
        </div>
        <p className={styles.aboutText}>
          ERU 是一个演示性质的 Web 应用，旨在展示现代前端开发的各个层面。
          从状态管理到表单处理，从 API 调用到用户认证，
          我们提供了完整的示例代码，帮助开发者快速上手 React 开发。
        </p>
      </section>

      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <div className={styles.lineShort} />
          <h2 className={styles.sectionTitle}>功能特性</h2>
          <div className={styles.lineShort} />
        </div>
        <div className={styles.featureGrid}>
          {features.map((item, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{item.icon}</div>
              <h3 className={styles.featureTitle}>{item.title}</h3>
              <p className={styles.featureDesc}>{item.desc}</p>
              <div className={styles.cardLine} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.stats}>
        {stats.map((item, idx) => (
          <div key={idx} className={styles.statItem}>
            <div className={styles.statLine} />
            <span className={styles.statValue}>{item.value}</span>
            <span className={styles.statLabel}>{item.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaBox}>
          <div className={styles.ctaLine} />
          <h3 className={styles.ctaTitle}>开始探索</h3>
          <p className={styles.ctaText}>通过侧边栏导航体验各项功能</p>
          <div className={styles.ctaLine} />
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLine} />
        <p className={styles.footerText}>ERU &copy; 2026 · 演示项目</p>
      </footer>
    </div>
  );
};

export default Main;
