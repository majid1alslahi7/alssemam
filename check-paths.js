#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// الألوان للإخراج
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}      فحص مسارات المشروع - السمام ${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);

// المجلدات المراد فحصها
const directoriesToCheck = [
  'app',
  'src/components',
  'src/context',
  'src/services',
  'src/utils',
  'public'
];

// الملفات التي تحتوي على مسارات supabase
const supabaseFiles = [];

// جمع جميع ملفات JavaScript/JSX
function findJsFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findJsFiles(filePath, fileList);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        fileList.push(filePath);
      }
    });
  } catch (err) {
    // تجاهل الأخطاء (مثل عدم وجود صلاحية)
  }
  return fileList;
}

// فحص وجود ملف supabase.js
console.log(`${colors.yellow}📁 1. فحص ملفات الخدمات الأساسية:${colors.reset}`);
const supabaseServicePath = path.join(process.cwd(), 'src/services/supabase.js');
if (fs.existsSync(supabaseServicePath)) {
  console.log(`   ${colors.green}✅ src/services/supabase.js موجود${colors.reset}`);
} else {
  console.log(`   ${colors.red}❌ src/services/supabase.js غير موجود${colors.reset}`);
}

// فحص مجلدات المشروع
console.log(`\n${colors.yellow}📁 2. فحص المجلدات الأساسية:${colors.reset}`);
directoriesToCheck.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`   ${colors.green}✅ ${dir}/ موجود${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ ${dir}/ غير موجود${colors.reset}`);
  }
});

// البحث عن ملفات تستخدم supabase
console.log(`\n${colors.yellow}🔍 3. فحص الملفات التي تستخدم supabase:${colors.reset}`);
const allJsFiles = findJsFiles(path.join(process.cwd(), 'app'));
const filesWithSupabase = [];

allJsFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('@/services/supabase') || content.includes('../services/supabase')) {
      filesWithSupabase.push(file);
    }
  } catch (err) {
    // تجاهل
  }
});

filesWithSupabase.forEach(file => {
  const relativePath = path.relative(process.cwd(), file);
  console.log(`   ${colors.green}📄 ${relativePath}${colors.reset}`);
});

// فحص المسارات النسبية
console.log(`\n${colors.yellow}🔧 4. فحص المسارات النسبية للمشروع:${colors.reset}`);

function checkRelativePath(filePath, importLine) {
  const match = importLine.match(/from ['"](\.\.\/)+services\/supabase['"]/);
  if (match) {
    const depth = (match[0].match(/\.\.\//g) || []).length;
    const expectedDepth = (filePath.split('/').length - 2);
    if (depth !== expectedDepth) {
      console.log(`   ${colors.red}⚠️ ${path.relative(process.cwd(), filePath)}: المسار غير صحيح (يحتاج ${expectedDepth} مستوى، وجد ${depth})${colors.reset}`);
    } else {
      console.log(`   ${colors.green}✅ ${path.relative(process.cwd(), filePath)}: المسار صحيح${colors.reset}`);
    }
  }
}

allJsFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.includes('from') && (line.includes('services/supabase') || line.includes('@/services/supabase'))) {
        checkRelativePath(file, line);
      }
    });
  } catch (err) {}
});

// فحص ملفات llms و robots
console.log(`\n${colors.yellow}🤖 5. فحص ملفات SEO للذكاء الاصطناعي:${colors.reset}`);
const seoFiles = ['llms.txt', 'llms-full.txt', 'robots.txt', 'sitemap.xml'];
seoFiles.forEach(file => {
  const filePath = path.join(process.cwd(), 'public', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ${colors.green}✅ public/${file} موجود (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ public/${file} غير موجود${colors.reset}`);
  }
});

// فحص مكون AIReadyFAQ
console.log(`\n${colors.yellow}🎨 6. فحص مكونات React:${colors.reset}`);
const faqComponent = path.join(process.cwd(), 'src/components/AIReadyFAQ.jsx');
if (fs.existsSync(faqComponent)) {
  console.log(`   ${colors.green}✅ src/components/AIReadyFAQ.jsx موجود (${(fs.statSync(faqComponent).size / 1024).toFixed(1)} KB)${colors.reset}`);
} else {
  console.log(`   ${colors.red}❌ src/components/AIReadyFAQ.jsx غير موجود${colors.reset}`);
}

// فحص ملفات البيئة
console.log(`\n${colors.yellow}🔐 7. فحص ملفات البيئة:${colors.reset}`);
const envFiles = ['.env.local', '.env.production', '.env.development'];
envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`   ${colors.green}✅ ${file} موجود${colors.reset}`);
  } else {
    console.log(`   ${colors.yellow}⚠️ ${file} غير موجود (اختياري)${colors.reset}`);
  }
});

// فحص إعدادات next.config.js
console.log(`\n${colors.yellow}⚙️ 8. فحص إعدادات Next.js:${colors.reset}`);
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log(`   ${colors.green}✅ next.config.js موجود${colors.reset}`);
  const configContent = fs.readFileSync(nextConfigPath, 'utf8');
  if (configContent.includes('output:') && configContent.includes('export')) {
    console.log(`   ${colors.yellow}⚠️ تنبيه: المشروع يستخدم static export${colors.reset}`);
  } else {
    console.log(`   ${colors.green}✅ المشروع في الوضع الديناميكي${colors.reset}`);
  }
} else {
  console.log(`   ${colors.red}❌ next.config.js غير موجود${colors.reset}`);
}

// إحصائيات نهائية
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                     ملخص الفحص${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);

let issues = 0;

if (!fs.existsSync(supabaseServicePath)) issues++;
directoriesToCheck.forEach(dir => {
  if (!fs.existsSync(path.join(process.cwd(), dir))) issues++;
});
seoFiles.forEach(file => {
  if (!fs.existsSync(path.join(process.cwd(), 'public', file))) issues++;
});

console.log(`\n${colors.white}📊 إجمالي الملفات التي تستخدم supabase: ${filesWithSupabase.length} ملف${colors.reset}`);
console.log(`${colors.white}📊 حجم المشروع: ${(execSync('du -sh . | cut -f1', { encoding: 'utf8' }).trim())}${colors.reset}`);
console.log(`${colors.white}📊 عدد الملفات: ${execSync('find . -name "*.js" -o -name "*.jsx" | wc -l', { encoding: 'utf8' }).trim()} ملف${colors.reset}`);

if (issues === 0) {
  console.log(`\n${colors.green}✅ جميع الملفات موجودة والمسارات صحيحة!${colors.reset}`);
} else {
  console.log(`\n${colors.red}⚠️ تم العثور على ${issues} مشكلة. يرجى مراجعة التفاصيل أعلاه.${colors.reset}`);
}

console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);
