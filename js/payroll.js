// js/payroll.js - Logika Penggajian PT. Bisatani (Cut-off 26 - 25)

const payroll = {
    calculate: async function() {
        const month = document.getElementById('payroll-month').value;
        const year = document.getElementById('payroll-year').value;
        
        console.log(`Menghitung gaji periode 26 bulan ${month-1} sampai 25 bulan ${month}`);
        
        // Tampilkan loading di tabel
        const tbody = document.getElementById('payroll-table-body');
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Sedang menghitung...</td></tr>';

        try {
            // Memanggil fungsi di Apps Script (Backend .gs)
            const response = await api.getPayrollData(month, year);
            this.renderTable(response);
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center" style="color:red">Gagal memuat data. Pastikan Backend .gs sudah siap.</td></tr>';
        }
    },

    renderTable: function(data) {
        const tbody = document.getElementById('payroll-table-body');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Tidak ada data absensi di periode ini.</td></tr>';
            return;
        }

        data.forEach(emp => {
            const row = `
                <tr>
                    <td>${emp.nama}</td>
                    <td>Rp ${emp.gajiPokok.toLocaleString()}</td>
                    <td>${emp.totalLembur} Jam</td>
                    <td>Rp ${emp.bonusLembur.toLocaleString()}</td>
                    <td>${emp.totalTelat} Mnt</td>
                    <td style="color:red">- Rp ${emp.dendaTelat.toLocaleString()}</td>
                    <td style="color:red">- Rp ${emp.bpjs.toLocaleString()}</td>
                    <td style="font-weight:bold; color:#10b981">Rp ${emp.gajiBersih.toLocaleString()}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }
};

// Fungsi tambahan untuk menyimpan tarif di settings.js
const settings = {
    savePayroll: function() {
        const data = {
            overtimeRate: document.getElementById('set-overtime-rate').value,
            lateRate: document.getElementById('set-late-rate').value,
            bpjsRate: document.getElementById('set-bpjs-rate').value
        };
        
        // Kirim ke database
        api.saveSettings(data).then(() => {
            alert("Tarif Gaji PT. Bisatani Berhasil Disimpan!");
        });
    }
};
