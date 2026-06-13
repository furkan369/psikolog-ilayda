/* ══════════════════════════════════════════════════════════════
   İlayda Evcil - Psikolog & Oyun Terapisti | JavaScript
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── HEADER SCROLL EFEKTİ ───
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 20);
        });
    }

    // ─── MOBİL MENÜ ───
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });

        // Menü linklerine tıklayınca menüyü kapat
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                menuToggle.classList.remove('active');
            });
        });
    }

    // ─── AKTİF NAV LİNK ───
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ─── RANDEVU SAYFASI: TARİH VE SAAT YÖNETİMİ ───
    const tarihInput = document.getElementById('tarih');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    const availabilityInfo = document.getElementById('availabilityInfo');
    const availabilityText = document.getElementById('availabilityText');

    // Bugünün tarihini varsayılan olarak ayarla
    if (tarihInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        tarihInput.value = `${yyyy}-${mm}-${dd}`;
        tarihInput.min = `${yyyy}-${mm}-${dd}`;

        // Sayfa yüklendiğinde saatleri göster
        generateTimeSlots(tarihInput.value);

        // Tarih değiştiğinde saatleri güncelle
        tarihInput.addEventListener('change', (e) => {
            generateTimeSlots(e.target.value);
        });
    }

    function generateTimeSlots(dateStr) {
        if (!timeSlotsGrid) return;

        timeSlotsGrid.innerHTML = '';

        // Saatler
        const slots = [
            { time: '10:00', status: 'available' },
            { time: '11:00', status: 'available' },
            { time: '12:00', status: 'available' },
            { time: '13:00', status: 'available' },
            { time: '14:00', status: 'available' },
            { time: '15:00', status: 'available' },
            { time: '16:00', status: 'available' }, // Artık dolu değil, her saat uygun
            { time: '17:00', status: 'available' },
            { time: '18:00', status: 'available' },
            { time: '19:00', status: 'available' },
            { time: '20:00', status: 'available' },
        ];

        const availableCount = slots.filter(s => s.status === 'available').length;

        // Tarihi formatla
        if (dateStr && availabilityInfo && availabilityText) {
            const parts = dateStr.split('-');
            const formattedDate = `${parts[2]} ${parts[1]} ${parts[0]}`;
            availabilityText.textContent = `${formattedDate} için uygunluk yüklendi. ${availableCount} uygun saat var.`;
            availabilityInfo.style.display = 'block';
        }

        let selectedSlot = null;

        slots.forEach(slot => {
            const div = document.createElement('div');
            div.className = `time-slot${slot.status === 'full' ? ' time-slot--full' : ''}`;

            div.innerHTML = `
                <p class="time-slot-time">${slot.time}</p>
                <p class="time-slot-status ${slot.status === 'available' ? 'time-slot-status--available' : 'time-slot-status--full'}">
                    ${slot.status === 'available' ? 'UYGUN' : 'DOLU'}
                </p>
            `;

            if (slot.status === 'available') {
                div.addEventListener('click', () => {
                    // Önceki seçimi kaldır
                    if (selectedSlot) {
                        selectedSlot.classList.remove('time-slot--selected');
                    }
                    div.classList.add('time-slot--selected');
                    selectedSlot = div;
                });
            }

            timeSlotsGrid.appendChild(div);
        });
    }

    // ─── FORM GÖNDERİMİ ───
    const randevuForm = document.getElementById('randevuForm');
    if (randevuForm) {
        randevuForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Sayfa yenilenmesini engelle

            const selectedTimeSlot = document.querySelector('.time-slot--selected');
            if (!selectedTimeSlot) {
                alert('Lütfen bir saat seçin.');
                return;
            }

            // Gönder butonunu "Gönderiliyor..." yap
            const submitBtn = randevuForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'GÖNDERİLİYOR...';
            submitBtn.disabled = true;

            const formData = {
                "Ad Soyad": document.getElementById('ad').value + " " + document.getElementById('soyad').value,
                "Telefon": document.getElementById('telefon').value,
                "E-posta": document.getElementById('eposta').value,
                "Konum": document.getElementById('konum').options[document.getElementById('konum').selectedIndex].text,
                "Tarih": document.getElementById('tarih').value,
                "Saat": selectedTimeSlot.querySelector('.time-slot-time').textContent.trim(),
                "_subject": "Yeni Randevu Talebi!"
            };

            // Formsubmit AJAX isteği ile veriyi maile yolla
            fetch("https://formsubmit.co/ajax/psikologilaydaevcil@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                alert(
                    "Randevu talebiniz başarıyla alınmış ve e-posta adresine iletilmiştir!\n\n" +
                    "En kısa sürede sizinle iletişime geçeceğiz."
                );
                
                // Formu sıfırla ve butonu geri yükle
                randevuForm.reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                if (timeSlotsGrid) {
                    generateTimeSlots(document.getElementById('tarih').value);
                }
            })
            .catch(error => {
                console.log(error);
                alert("Gönderim sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin veya doğrudan iletişime geçin.");
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // ─── SAYFA GİRİŞ ANİMASYONLARI ───
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animasyon uygulanacak elemanlar
    const animateElements = document.querySelectorAll(
        '.service-card, .about-col, .expertise-col, .contact-item, .info-box'
    );

    animateElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
        observer.observe(el);
    });
});
