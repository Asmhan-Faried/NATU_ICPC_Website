// الحصول على العناصر
const dropdown = document.querySelector('.dropdown');
const dropdownBtn = document.querySelector('.dropdown-btn');
const dropdownText = document.querySelector('.dropdown-text');
const dropdownMenu = document.querySelector('.dropdown-menu');
const dropdownOptions = document.querySelectorAll('.dropdown-menu a');

// إضافة حدث عند الفوكس على الزر لفتح القائمة
dropdownBtn.addEventListener('focus', () => {
    dropdown.classList.add('open'); // إضافة الكلاس "open" لعرض القائمة
});

// إغلاق القائمة عند فقدان التركيز عن الزر
dropdownBtn.addEventListener('focusout', () => {
    dropdown.classList.remove('open'); // إزالة الكلاس "open" لإغلاق القائمة
});

// تغيير النص عند اختيار خيار من القائمة
dropdownOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault(); // منع التوجيه الافتراضي للرابط
        dropdownText.textContent = option.dataset.value; // تحديث النص
        dropdown.classList.remove('open'); // إغلاق القائمة بعد الاختيار
    });
});

// إغلاق القائمة عند الضغط خارجها
document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== dropdownBtn) {
        dropdown.classList.remove('open');
    }
});

// إضافة حدث عند الفوكس على الزر لفتح القائمة
dropdownBtn.addEventListener('focus', () => {
    dropdown.classList.add('open'); // إضافة الكلاس "open" لعرض القائمة
});

// إغلاق القائمة عند فقدان التركيز عن الزر
dropdownBtn.addEventListener('focusout', () => {
    dropdown.classList.remove('open'); // إزالة الكلاس "open" لإغلاق القائمة
});
