document.addEventListener("DOMContentLoaded", () => {
    // 1. Konfigurasi Nomor Admin Tujuan
    const ADMIN_PHONE = "6285602531776";

    // 2. Alur Modal Pembuka
    const modalWelcomeEl = document.getElementById("modalWelcome");
    const modalInstructionEl = document.getElementById("modalInstruction");
    const btnOkWelcome = document.getElementById("btnOkWelcome");

    const modalWelcome = new bootstrap.Modal(modalWelcomeEl);
    const modalInstruction = new bootstrap.Modal(modalInstructionEl);

    modalWelcome.show();

    btnOkWelcome.addEventListener("click", () => {
        modalWelcome.hide();
        modalInstruction.show();
    });

    // 3. Multi-Step Form Logic
    let currentStep = 1;
    const totalSteps = 6;

    const nextButtons = document.querySelectorAll(".next-btn");
    const prevButtons = document.querySelectorAll(".prev-btn");
    const progressBar = document.getElementById("progressBar");
    const stepIndicators = document.querySelectorAll(".step");

    function updateStepDisplay() {
        for (let i = 1; i <= totalSteps; i++) {
            const stepEl = document.getElementById(`step-${i}`);
            if (stepEl) {
                if (i === currentStep) {
                    stepEl.classList.remove("d-none");
                } else {
                    stepEl.classList.add("d-none");
                }
            }
        }

        stepIndicators.forEach((indicator) => {
            const stepNum = parseInt(indicator.getAttribute("data-step"));
            indicator.classList.remove("active", "completed");

            if (stepNum === currentStep) {
                indicator.classList.add("active");
            } else if (stepNum < currentStep) {
                indicator.classList.add("completed");
            }
        });

        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    nextButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepDisplay();
            }
        });
    });

    prevButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepDisplay();
            }
        });
    });

    // 4. Helper Function: Format Tanggal ke "Hari, DD Bulan YYYY"
    function formatTanggalIndo(dateString) {
        if (!dateString || dateString.trim() === "") return "-";

        const namaHari = [
            "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
        ];

        const namaBulan = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const bagian = dateString.split("-");
        if (bagian.length !== 3) return dateString;

        const tahun = parseInt(bagian[0], 10);
        const bulanIndex = parseInt(bagian[1], 10) - 1;
        const hari = parseInt(bagian[2], 10);

        const dateObj = new Date(tahun, bulanIndex, hari);
        const dayOfWeek = dateObj.getDay();

        if (bulanIndex >= 0 && bulanIndex < 12 && !isNaN(dayOfWeek)) {
            return `${namaHari[dayOfWeek]}, ${hari} ${namaBulan[bulanIndex]} ${tahun}`;
        }

        return dateString;
    }

    // 5. Formatting Data ke WhatsApp
    const submitBtn = document.getElementById("submitWA");

    submitBtn.addEventListener("click", () => {
        const val = (id) => {
            const el = document.getElementById(id);
            return el && el.value.trim() !== "" ? el.value.trim() : "-";
        };

        const valDate = (id) => {
            const el = document.getElementById(id);
            return el ? formatTanggalIndo(el.value) : "-";
        };

        const acara1Type = document.querySelector('input[name="acara1"]:checked')?.value || "Akad Nikah";
        const acara2Type = document.querySelector('input[name="acara2"]:checked')?.value || "Resepsi";

        const message = `*FORM UNDANGAN WEBSITE*
---------------------------------------
*URUTAN NAMA:* ${val("urutan_nama")}

*MEMPELAI WANITA*
• Nama Panggilan: ${val("panggilan_wanita")}
• Nama Lengkap: ${val("lengkap_wanita")}
• Putri Ke: ${val("putri_ke")}
• Nama Ayah: ${val("ayah_wanita")}
• Nama Ibu: ${val("ibu_wanita")}

*MEMPELAI PRIA*
• Nama Panggilan: ${val("panggilan_pria")}
• Nama Lengkap: ${val("lengkap_pria")}
• Putra Ke: ${val("putra_ke")}
• Nama Ayah: ${val("ayah_pria")}
• Nama Ibu: ${val("ibu_pria")}

*${acara1Type.toUpperCase()}*
• Tanggal: ${valDate("tgl_akad")}
• Pukul: ${val("jam_akad")}
• Tempat: ${val("tempat_akad")}
• Alamat: ${val("alamat_akad")}

*${acara2Type.toUpperCase()}*
• Tanggal: ${valDate("tgl_resepsi")}
• Pukul: ${val("jam_resepsi")}
• Tempat: ${val("tempat_resepsi")}
• Alamat: ${val("alamat_resepsi")}


*GIFT & LOVE STORY*
• Rekening Gift: ${val("rekening")}
• Alamat Kirim Kado: ${val("alamat_kado")}
• Cerita / Love Story: ${val("love_story")}
• Maps: ${val("maps_resepsi")}

*REQUEST & INFORMASI*
• Lagu / Backsound: ${val("music")}
• No WhatsApp Klien: ${val("wa_client")}
• Tema Pilihan: ${val("tema_pilihan")}
• Tema Agama / Nuansa: ${val("tema_agama")}
---------------------------------------`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodedMessage}`;
        window.open(waUrl, "_blank");
    });
});