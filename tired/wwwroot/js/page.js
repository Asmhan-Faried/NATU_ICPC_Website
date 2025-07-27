// إغلاق البابل عند الضغط على الزر
function closePopup() {
    document.getElementById("popup").style.display = "none";
  }


  
  // ممكن لاحقًا نستخدم localStorage لو حبيتي تظهر مرة واحدة بس لكل زائر
  // مثلاً:
  // if (!localStorage.getItem("popupShown")) {
  //   document.getElementById("popup").style.display = "flex";
  //   localStorage.setItem("popupShown", true);
  // } else {
  //   document.getElementById("popup").style.display = "none";
  // }
  



function openPopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "flex";
  }

  function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "none";
  }









  function openPopup(id) {
    const popup = document.getElementById(id);
    if (popup) popup.style.display = "flex";
  }

  // دالة إغلاق البابل حسب ID
  function closePopup(id) {
    const popup = document.getElementById(id);
    if (popup) popup.style.display = "none";
  }

  // لعرض البابل الرئيسية أول مرة فقط (اختياري)
  window.onload = () => {
    if (!localStorage.getItem("popupShown")) {
      document.getElementById("popup").style.display = "flex";
      localStorage.setItem("popupShown", true);
    }
  };









  // تحديد جميع الأزرار
  const soundButtons = [
    { button: document.getElementById('soundButton1'), sound: document.getElementById('buttonSound1') },
    { button: document.getElementById('soundButton2'), sound: document.getElementById('buttonSound2') },
    { button: document.getElementById('soundButton3'), sound: document.getElementById('buttonSound3') },
    { button: document.getElementById('soundButton4'), sound: document.getElementById('buttonSound4') },
    { button: document.getElementById('soundButton5'), sound: document.getElementById('buttonSound5') },
    { button: document.getElementById('soundButton6'), sound: document.getElementById('buttonSound6') },
    { button: document.getElementById('soundButton7'), sound: document.getElementById('buttonSound7') }
  ];

  // إضافة الأحداث لكل زر مع الصوت الخاص به
  soundButtons.forEach(({ button, sound }) => {
    let isClicked = false;

    if (button && sound) {
      // لما الماوس يدخل
      button.addEventListener("mouseenter", () => {
        if (!isClicked) {
          sound.currentTime = 0;
          sound.play();
        }
      });

      // لما الماوس يخرج
      button.addEventListener("mouseleave", () => {
        if (!isClicked) {
          sound.pause();
          sound.currentTime = 0;
        }
      });

      // لما يدوس على الزرار
      button.addEventListener("click", () => {
        isClicked = true;

        // نسيب الصوت يكمل لو شغال، ولو مش شغال نشغله
        if (sound.paused) {
          sound.currentTime = 0;
          sound.play();
        }

        // بعد ثواني (مدة الصوت مثلاً)، نرجع isClicked = false
        setTimeout(() => {
          isClicked = false;
        }, 5000); // 5000 ملي ثانية = 5 ثواني
      });
    }
  });

  // تشغيل الصوت عند الضغط
  // button.addEventListener("click", () => {
  //   sound.currentTime = 0;
  //   sound.play();
  // });


