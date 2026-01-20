const express = require('express');
const router = express.Router();

// Projects data
const projects = {
  'fintech-platform': {
    id: 1,
    slug: 'fintech-platform',
    title: 'FinFlow',
    subtitle: 'E-commerce Fintech Platform',
    description: 'A comprehensive financial technology platform designed for modern e-commerce businesses. FinFlow seamlessly integrates payment processing, fraud detection, and financial analytics into a unified solution that scales with enterprise demands.',
    client: 'Global Retail Corp',
    duration: '18 months',
    team: '24 engineers, 4 designers, 3 product managers',
    technologies: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'Kubernetes', 'AWS', 'Stripe API', 'TensorFlow'],
    challenges: [
      'Processing over 50,000 transactions per minute during peak hours',
      'Implementing real-time fraud detection with minimal false positives',
      'Ensuring PCI-DSS compliance across all payment touchpoints',
      'Integrating with 15+ legacy banking systems'
    ],
    solutions: [
      'Designed microservices architecture with auto-scaling capabilities',
      'Built ML-powered fraud detection engine with 99.7% accuracy',
      'Implemented end-to-end encryption and tokenization for all sensitive data',
      'Created universal adapter layer for legacy system integration'
    ],
    results: [
      { metric: 'Transaction Volume', value: '300% increase in processing capacity' },
      { metric: 'Fraud Prevention', value: '$12M saved annually in fraud losses' },
      { metric: 'System Uptime', value: '99.99% availability achieved' },
      { metric: 'Processing Speed', value: '45% reduction in transaction latency' }
    ],
    features: ['Real-time payment processing', 'AI fraud detection', 'Multi-currency support', 'Automated reconciliation', 'Compliance dashboard', 'Custom reporting'],
    testimonial: {
      quote: 'FinFlow transformed our payment infrastructure. We went from processing 10K transactions daily to over 2 million, with better security and lower costs.',
      author: 'Sarah Chen, CTO at Global Retail Corp'
    }
  },
  'healthcare-platform': {
    id: 2,
    slug: 'healthcare-platform',
    title: 'MedConnect',
    subtitle: 'Healthcare Management System',
    description: 'An integrated healthcare management platform connecting patients, providers, and payers. MedConnect streamlines clinical workflows, enables telemedicine, and provides actionable insights through advanced health analytics.',
    client: 'United Health Network',
    duration: '24 months',
    team: '32 engineers, 6 designers, 5 product managers, 2 healthcare consultants',
    technologies: ['Python', 'Django', 'React Native', 'MongoDB', 'HL7 FHIR', 'Azure', 'Docker', 'Elasticsearch'],
    challenges: [
      'Ensuring HIPAA compliance across all data touchpoints',
      'Integrating with diverse EHR systems from multiple vendors',
      'Building reliable telemedicine infrastructure for rural areas',
      'Managing sensitive patient data across state boundaries'
    ],
    solutions: [
      'Implemented zero-trust security architecture with audit logging',
      'Built FHIR-compliant integration engine supporting 20+ EHR systems',
      'Developed adaptive video streaming with low-bandwidth optimization',
      'Created federated data architecture respecting jurisdictional requirements'
    ],
    results: [
      { metric: 'Patient Engagement', value: '85% increase in portal adoption' },
      { metric: 'Administrative Costs', value: '40% reduction in paperwork' },
      { metric: 'Appointment No-shows', value: '60% decrease with smart reminders' },
      { metric: 'Provider Efficiency', value: '3 hours saved per provider daily' }
    ],
    features: ['Patient portal', 'Telemedicine', 'E-prescriptions', 'Lab integrations', 'Appointment scheduling', 'Health analytics'],
    testimonial: {
      quote: 'MedConnect has revolutionized how we deliver care. Our providers spend more time with patients and less time on paperwork.',
      author: 'Dr. Michael Roberts, Chief Medical Officer at United Health Network'
    }
  },
  'inventory-system': {
    id: 3,
    slug: 'inventory-system',
    title: 'StockAI',
    subtitle: 'AI-Powered Inventory Management',
    description: 'An intelligent inventory management system leveraging machine learning for demand forecasting, automated reordering, and warehouse optimization. StockAI helps enterprises minimize carrying costs while preventing stockouts.',
    client: 'MegaMart Distribution',
    duration: '14 months',
    team: '18 engineers, 3 designers, 2 product managers, 2 data scientists',
    technologies: ['Python', 'FastAPI', 'Vue.js', 'PostgreSQL', 'Apache Kafka', 'TensorFlow', 'GCP', 'BigQuery'],
    challenges: [
      'Predicting demand across 50,000+ SKUs with seasonal variations',
      'Real-time inventory tracking across 200+ warehouse locations',
      'Optimizing warehouse layouts for picking efficiency',
      'Reducing waste for perishable goods inventory'
    ],
    solutions: [
      'Developed ensemble ML models combining time-series and external factors',
      'Implemented IoT-based tracking with RFID and computer vision',
      'Created AI-driven slotting optimization algorithm',
      'Built expiration prediction system with dynamic pricing integration'
    ],
    results: [
      { metric: 'Inventory Accuracy', value: '99.8% real-time accuracy achieved' },
      { metric: 'Carrying Costs', value: '35% reduction in holding expenses' },
      { metric: 'Stockout Rate', value: '78% decrease in out-of-stock incidents' },
      { metric: 'Warehouse Efficiency', value: '25% improvement in pick rates' }
    ],
    features: ['Demand forecasting', 'Auto-reordering', 'Warehouse optimization', 'Supplier management', 'Expiration tracking', 'Analytics dashboard'],
    testimonial: {
      quote: 'StockAI paid for itself within 6 months. The demand forecasting alone saved us millions in overstock and emergency shipping costs.',
      author: 'James Wilson, VP of Operations at MegaMart Distribution'
    }
  },
  'analytics-platform': {
    id: 4,
    slug: 'analytics-platform',
    title: 'DataPulse',
    subtitle: 'Real-Time Analytics Dashboard',
    description: 'A powerful real-time analytics platform that transforms raw data into actionable business intelligence. DataPulse provides customizable dashboards, automated reporting, and predictive insights for data-driven decision making.',
    client: 'TechVentures Inc',
    duration: '12 months',
    team: '16 engineers, 4 designers, 2 product managers, 3 data engineers',
    technologies: ['Go', 'React', 'Apache Druid', 'Apache Kafka', 'ClickHouse', 'Grafana', 'AWS', 'Terraform'],
    challenges: [
      'Processing 10+ billion events daily with sub-second latency',
      'Supporting complex ad-hoc queries without performance degradation',
      'Enabling self-service analytics for non-technical users',
      'Ensuring data consistency across distributed data sources'
    ],
    solutions: [
      'Built streaming architecture with exactly-once processing guarantees',
      'Implemented intelligent query optimization with automatic caching',
      'Created intuitive drag-and-drop dashboard builder',
      'Developed CDC pipelines with conflict resolution mechanisms'
    ],
    results: [
      { metric: 'Query Performance', value: '95% of queries under 500ms' },
      { metric: 'Data Freshness', value: 'Real-time data within 2 seconds' },
      { metric: 'User Adoption', value: '500+ active business users' },
      { metric: 'Decision Speed', value: '70% faster insights to action' }
    ],
    features: ['Real-time dashboards', 'Custom visualizations', 'Automated alerts', 'Scheduled reports', 'Data exploration', 'Embedded analytics'],
    testimonial: {
      quote: 'DataPulse democratized data across our organization. Every team now has instant access to the metrics that matter most to them.',
      author: 'Emily Zhang, Chief Data Officer at TechVentures Inc'
    }
  }
};


// Projects listing page
router.get('/', (req, res) => {
  const projectList = Object.values(projects).map(project => ({
    id: project.id,
    slug: project.slug,
    name: project.title,
    title: project.title,
    subtitle: project.subtitle,
    description: project.description,
    technologies: project.technologies,
    results: project.results,
    client: project.client
  }));

  res.render('pages/projects', {
    title: 'Our Projects | DevX360',
    projects: projectList
  });
});

// Individual project page
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const projectData = projects[slug];

  if (!projectData) {
    return res.status(404).render('pages/404', {
      title: 'Project Not Found | DevX360',
      message: 'The project you are looking for does not exist.'
    });
  }

  // Add name field for template compatibility
  const project = {
    ...projectData,
    name: projectData.title
  };

  res.render('pages/project', {
    title: `${project.title} | DevX360`,
    project
  });
});

module.exports = router;

