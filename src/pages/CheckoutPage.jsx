import { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

// Helper: Convert string to Title Case
function toTitleCase(str) {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function formatProvinceName(name) {
  if (!name) return '';

  const normalizedName = name
    .replace(/Kepulauan Bangka Belitung/i, 'Bangka Belitung')
    .trim();

  return `BPS Provinsi ${toTitleCase(normalizedName)}`;
}

// Helper: Format number to Rupiah currency
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}

// Fallback Provinces (Offline support)
const fallbackProvinces = [
  { id: '11', name: 'BPS Provinsi Aceh' },
  { id: '12', name: 'BPS Provinsi Sumatera Utara' },
  { id: '13', name: 'BPS Provinsi Sumatera Barat' },
  { id: '14', name: 'BPS Provinsi Riau' },
  { id: '15', name: 'BPS Provinsi Jambi' },
  { id: '16', name: 'BPS Provinsi Sumatera Selatan' },
  { id: '17', name: 'BPS Provinsi Bengkulu' },
  { id: '18', name: 'BPS Provinsi Lampung' },
  { id: '19', name: 'BPS Provinsi Bangka Belitung' },
  { id: '21', name: 'BPS Provinsi Kepulauan Riau' },
  { id: '31', name: 'BPS Provinsi DKI Jakarta' },
  { id: '32', name: 'BPS Provinsi Jawa Barat' },
  { id: '33', name: 'BPS Provinsi Jawa Tengah' },
  { id: '34', name: 'BPS Provinsi Daerah Istimewa Yogyakarta' },
  { id: '35', name: 'BPS Provinsi Jawa Timur' },
  { id: '36', name: 'BPS Provinsi Banten' },
  { id: '51', name: 'BPS Provinsi Bali' },
  { id: '52', name: 'BPS Provinsi Nusa Tenggara Barat' },
  { id: '53', name: 'BPS Provinsi Nusa Tenggara Timur' },
  { id: '61', name: 'BPS Provinsi Kalimantan Barat' },
  { id: '62', name: 'BPS Provinsi Kalimantan Tengah' },
  { id: '63', name: 'BPS Provinsi Kalimantan Selatan' },
  { id: '64', name: 'BPS Provinsi Kalimantan Timur' },
  { id: '65', name: 'BPS Provinsi Kalimantan Utara' },
  { id: '71', name: 'BPS Provinsi Sulawesi Utara' },
  { id: '72', name: 'BPS Provinsi Sulawesi Tengah' },
  { id: '73', name: 'BPS Provinsi Sulawesi Selatan' },
  { id: '74', name: 'BPS Provinsi Sulawesi Tenggara' },
  { id: '75', name: 'BPS Provinsi Gorontalo' },
  { id: '76', name: 'BPS Provinsi Sulawesi Barat' },
  { id: '81', name: 'BPS Provinsi Maluku' },
  { id: '82', name: 'BPS Provinsi Maluku Utara' },
  { id: '91', name: 'BPS Provinsi Papua Barat' },
  { id: '92', name: 'BPS Provinsi Papua' },
  { id: '93', name: 'BPS Provinsi Papua Tengah' },
  { id: '94', name: 'BPS Provinsi Papua Pegunungan' },
  { id: '95', name: 'BPS Provinsi Papua Selatan' },
  { id: '96', name: 'BPS Provinsi Papua Barat Daya' }
];

// Fallback Cities (Offline support)
const fallbackCities = [
  // Jawa Timur (35)
  { id: '3501', provinceId: '35', name: 'Kabupaten Pacitan' },
  { id: '3502', provinceId: '35', name: 'Kabupaten Ponorogo' },
  { id: '3503', provinceId: '35', name: 'Kabupaten Trenggalek' },
  { id: '3504', provinceId: '35', name: 'Kabupaten Tulungagung' },
  { id: '3505', provinceId: '35', name: 'Kabupaten Blitar' },
  { id: '3506', provinceId: '35', name: 'Kabupaten Kediri' },
  { id: '3507', provinceId: '35', name: 'Kabupaten Malang' },
  { id: '3508', provinceId: '35', name: 'Kabupaten Lumajang' },
  { id: '3509', provinceId: '35', name: 'Kabupaten Jember' },
  { id: '3510', provinceId: '35', name: 'Kabupaten Banyuwangi' },
  { id: '3511', provinceId: '35', name: 'Kabupaten Bondowoso' },
  { id: '3512', provinceId: '35', name: 'Kabupaten Situbondo' },
  { id: '3513', provinceId: '35', name: 'Kabupaten Probolinggo' },
  { id: '3514', provinceId: '35', name: 'Kabupaten Pasuruan' },
  { id: '3515', provinceId: '35', name: 'Kabupaten Sidoarjo' },
  { id: '3516', provinceId: '35', name: 'Kabupaten Mojokerto' },
  { id: '3517', provinceId: '35', name: 'Kabupaten Jombang' },
  { id: '3518', provinceId: '35', name: 'Kabupaten Nganjuk' },
  { id: '3519', provinceId: '35', name: 'Kabupaten Madiun' },
  { id: '3520', provinceId: '35', name: 'Kabupaten Magetan' },
  { id: '3521', provinceId: '35', name: 'Kabupaten Ngawi' },
  { id: '3522', provinceId: '35', name: 'Kabupaten Bojonegoro' },
  { id: '3523', provinceId: '35', name: 'Kabupaten Tuban' },
  { id: '3524', provinceId: '35', name: 'Kabupaten Lamongan' },
  { id: '3525', provinceId: '35', name: 'Kabupaten Gresik' },
  { id: '3526', provinceId: '35', name: 'Kabupaten Bangkalan' },
  { id: '3527', provinceId: '35', name: 'Kabupaten Sampang' },
  { id: '3528', provinceId: '35', name: 'Kabupaten Pamekasan' },
  { id: '3529', provinceId: '35', name: 'Kabupaten Sumenep' },
  { id: '3571', provinceId: '35', name: 'Kota Kediri' },
  { id: '3572', provinceId: '35', name: 'Kota Blitar' },
  { id: '3573', provinceId: '35', name: 'Kota Malang' },
  { id: '3574', provinceId: '35', name: 'Kota Probolinggo' },
  { id: '3575', provinceId: '35', name: 'Kota Pasuruan' },
  { id: '3576', provinceId: '35', name: 'Kota Mojokerto' },
  { id: '3577', provinceId: '35', name: 'Kota Madiun' },
  { id: '3578', provinceId: '35', name: 'Kota Surabaya' },
  { id: '3579', provinceId: '35', name: 'Kota Batu' },

  // Jawa Tengah (33)
  { id: '3301', provinceId: '33', name: 'Kabupaten Cilacap' },
  { id: '3302', provinceId: '33', name: 'Kabupaten Banyumas' },
  { id: '3303', provinceId: '33', name: 'Kabupaten Purbalingga' },
  { id: '3304', provinceId: '33', name: 'Kabupaten Banjarnegara' },
  { id: '3305', provinceId: '33', name: 'Kabupaten Kebumen' },
  { id: '3306', provinceId: '33', name: 'Kabupaten Purworejo' },
  { id: '3307', provinceId: '33', name: 'Kabupaten Wonosobo' },
  { id: '3308', provinceId: '33', name: 'Kabupaten Magelang' },
  { id: '3309', provinceId: '33', name: 'Kabupaten Boyolali' },
  { id: '3310', provinceId: '33', name: 'Kabupaten Klaten' },
  { id: '3311', provinceId: '33', name: 'Kabupaten Sukoharjo' },
  { id: '3312', provinceId: '33', name: 'Kabupaten Wonogiri' },
  { id: '3313', provinceId: '33', name: 'Kabupaten Karanganyar' },
  { id: '3314', provinceId: '33', name: 'Kabupaten Sragen' },
  { id: '3315', provinceId: '33', name: 'Kabupaten Grobogan' },
  { id: '3316', provinceId: '33', name: 'Kabupaten Blora' },
  { id: '3317', provinceId: '33', name: 'Kabupaten Rembang' },
  { id: '3318', provinceId: '33', name: 'Kabupaten Pati' },
  { id: '3319', provinceId: '33', name: 'Kabupaten Kudus' },
  { id: '3320', provinceId: '33', name: 'Kabupaten Jepara' },
  { id: '3321', provinceId: '33', name: 'Kabupaten Demak' },
  { id: '3322', provinceId: '33', name: 'Kabupaten Semarang' },
  { id: '3323', provinceId: '33', name: 'Kabupaten Temanggung' },
  { id: '3324', provinceId: '33', name: 'Kabupaten Kendal' },
  { id: '3325', provinceId: '33', name: 'Kabupaten Batang' },
  { id: '3326', provinceId: '33', name: 'Kabupaten Pekalongan' },
  { id: '3327', provinceId: '33', name: 'Kabupaten Pemalang' },
  { id: '3328', provinceId: '33', name: 'Kabupaten Tegal' },
  { id: '3329', provinceId: '33', name: 'Kabupaten Brebes' },
  { id: '3371', provinceId: '33', name: 'Kota Magelang' },
  { id: '3372', provinceId: '33', name: 'Kota Surakarta' },
  { id: '3373', provinceId: '33', name: 'Kota Salatiga' },
  { id: '3374', provinceId: '33', name: 'Kota Semarang' },
  { id: '3375', provinceId: '33', name: 'Kota Pekalongan' },
  { id: '3376', provinceId: '33', name: 'Kota Tegal' },

  // Jawa Barat (32)
  { id: '3201', provinceId: '32', name: 'Kabupaten Bogor' },
  { id: '3202', provinceId: '32', name: 'Kabupaten Sukabumi' },
  { id: '3203', provinceId: '32', name: 'Kabupaten Cianjur' },
  { id: '3204', provinceId: '32', name: 'Kabupaten Bandung' },
  { id: '3205', provinceId: '32', name: 'Kabupaten Garut' },
  { id: '3206', provinceId: '32', name: 'Kabupaten Tasikmalaya' },
  { id: '3207', provinceId: '32', name: 'Kabupaten Ciamis' },
  { id: '3208', provinceId: '32', name: 'Kabupaten Kuningan' },
  { id: '3209', provinceId: '32', name: 'Kabupaten Cirebon' },
  { id: '3210', provinceId: '32', name: 'Kabupaten Majalengka' },
  { id: '3211', provinceId: '32', name: 'Kabupaten Sumedang' },
  { id: '3212', provinceId: '32', name: 'Kabupaten Indramayu' },
  { id: '3213', provinceId: '32', name: 'Kabupaten Subang' },
  { id: '3214', provinceId: '32', name: 'Kabupaten Purwakarta' },
  { id: '3215', provinceId: '32', name: 'Kabupaten Karawang' },
  { id: '3216', provinceId: '32', name: 'Kabupaten Bekasi' },
  { id: '3217', provinceId: '32', name: 'Kabupaten Bandung Barat' },
  { id: '3218', provinceId: '32', name: 'Kabupaten Pangandaran' },
  { id: '3271', provinceId: '32', name: 'Kota Bogor' },
  { id: '3272', provinceId: '32', name: 'Kota Sukabumi' },
  { id: '3273', provinceId: '32', name: 'Kota Bandung' },
  { id: '3274', provinceId: '32', name: 'Kota Cirebon' },
  { id: '3275', provinceId: '32', name: 'Kota Bekasi' },
  { id: '3276', provinceId: '32', name: 'Kota Depok' },
  { id: '3277', provinceId: '32', name: 'Kota Cimahi' },
  { id: '3278', provinceId: '32', name: 'Kota Tasikmalaya' },
  { id: '3279', provinceId: '32', name: 'Kota Banjar' },

  // DKI Jakarta (31)
  { id: '3101', provinceId: '31', name: 'Kabupaten Kepulauan Seribu' },
  { id: '3171', provinceId: '31', name: 'Kota Jakarta Selatan' },
  { id: '3172', provinceId: '31', name: 'Kota Jakarta Timur' },
  { id: '3173', provinceId: '31', name: 'Kota Jakarta Pusat' },
  { id: '3174', provinceId: '31', name: 'Kota Jakarta Barat' },
  { id: '3175', provinceId: '31', name: 'Kota Jakarta Utara' },

  // DI Yogyakarta (34)
  { id: '3401', provinceId: '34', name: 'Kabupaten Kulon Progo' },
  { id: '3402', provinceId: '34', name: 'Kabupaten Bantul' },
  { id: '3403', provinceId: '34', name: 'Kabupaten Gunungkidul' },
  { id: '3404', provinceId: '34', name: 'Kabupaten Sleman' },
  { id: '3471', provinceId: '34', name: 'Kota Yogyakarta' }
];

const ReceiptProofImage = ({ src }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (src && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      // We don't set crossOrigin for data URIs to avoid strict browser CORS blocks
      img.src = src;
    }
  }, [src]);

  return (
    <canvas 
      ref={canvasRef} 
      id="receipt-uploaded-proof"
      className="max-w-full max-h-full object-contain mx-auto block"
    />
  );
};

export default function CheckoutPage({
  cartItems = [],
  onBackToDashboard,
  role = 'Guest',
  setRole,
  onAddToCart,
  onRemoveFromCart,
  onClearCart
}) {
  // Form State
  const [panggilan, setPanggilan] = useState('');
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [hotel, setHotel] = useState('');
  const [kamar, setKamar] = useState('');

  // Dropdown States
  const [provincesList, setProvincesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [provQuery, setProvQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [showProvDropdown, setShowProvDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showPanggilanDropdown, setShowPanggilanDropdown] = useState(false);
  const [isRegionsLoading, setIsRegionsLoading] = useState(false);

  // Payment State
  const [activePaymentMethod, setActivePaymentMethod] = useState('qris'); // 'qris' | 'transfer' | 'cash'
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [isAdminCashChecked, setIsAdminCashChecked] = useState(false);

  // Submit & Screen States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState(null);
  const [orderTime, setOrderTime] = useState(null);
  const [hasAutofillData, setHasAutofillData] = useState(false);
  const [receiptItems, setReceiptItems] = useState([]);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Refs for closing dropdowns on click outside
  const provRef = useRef(null);
  const cityRef = useRef(null);
  const panggilanRef = useRef(null);
  const fileInputRef = useRef(null);
  const cityInputRef = useRef(null);

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, item) => acc + (item.harga * item.quantity), 0);
  const discount = 0; // Biarkan sesuai instruksi (diskon dinonaktifkan / 0)
  const total = subtotal - discount;

  const receiptSubtotal = receiptItems.reduce((acc, item) => acc + (item.harga * item.quantity), 0);
  const receiptTotal = receiptSubtotal - discount;

  const currentItems = showReceipt ? receiptItems : cartItems;
  const currentSubtotal = showReceipt ? receiptSubtotal : subtotal;
  const currentTotal = showReceipt ? receiptTotal : total;

  // Show Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // 1. Fetch Provinces on Mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsRegionsLoading(true);
      try {
        // Gunakan AbortController untuk timeout 3 detik agar tidak memblokir loading selamanya jika internet lambat
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // Menggunakan cdn.jsdelivr.net yang bebas CORS dan sangat cepat dibanding github.io langsung
        const response = await fetch('https://cdn.jsdelivr.net/gh/emsifa/api-wilayah-indonesia@gh-pages/api/provinces.json', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const formatted = data.map(p => ({
          id: p.id,
          name: formatProvinceName(p.name)
        })).sort((a, b) => a.name.localeCompare(b.name));
        setProvincesList(formatted);
      } catch (error) {
        console.warn("Gagal memuat API provinsi, menggunakan data offline:", error);
        setProvincesList([...fallbackProvinces].sort((a, b) => a.name.localeCompare(b.name)));
      } finally {
        setIsRegionsLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  // 2. Fetch Cities when Selected Province Changes
  useEffect(() => {
    // Reset list kota agar tidak menampilkan data lama saat loading
    setCitiesList([]);
    
    if (!selectedProvince) {
      return;
    }
    const fetchCities = async () => {
      setIsRegionsLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // Menggunakan cdn.jsdelivr.net yang bebas CORS dan sangat cepat dibanding github.io langsung
        const response = await fetch(`https://cdn.jsdelivr.net/gh/emsifa/api-wilayah-indonesia@gh-pages/api/regencies/${selectedProvince.id}.json`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const formatted = data.map(c => ({
          id: c.id,
          provinceId: selectedProvince.id,
          name: toTitleCase(c.name)
        })).sort((a, b) => a.name.localeCompare(b.name));
        setCitiesList(formatted);
      } catch (error) {
        console.warn("Gagal memuat API kota, menggunakan data offline:", error);
        const fallback = fallbackCities.filter(c => c.provinceId === selectedProvince.id)
                                      .sort((a, b) => a.name.localeCompare(b.name));
        setCitiesList(fallback);
      } finally {
        setIsRegionsLoading(false);
      }
    };
    fetchCities();
  }, [selectedProvince]);

  // 3. Draft Persistence & Restore
  useEffect(() => {
    // Check if user has saved profile
    const savedProfile = sessionStorage.getItem('dwp_bps_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed && parsed.nama) {
          setHasAutofillData(true);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Restore Form Draft
    const savedDraft = sessionStorage.getItem('dwp_bps_form_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft) {
          if (draft.panggilan) setPanggilan(draft.panggilan);
          if (draft.nama) setNama(draft.nama);
          if (draft.whatsapp) setWhatsapp(draft.whatsapp);
          if (draft.hotel) setHotel(draft.hotel);
          if (draft.kamar) setKamar(draft.kamar);
          if (draft.province) {
            setSelectedProvince(draft.province);
            setProvQuery(draft.province.name);
          }
          if (draft.city) {
            setSelectedCity(draft.city);
            setCityQuery(draft.city.name);
          }
          if (draft.cashChecked) {
            setIsAdminCashChecked(true);
            setActivePaymentMethod('cash');
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Restore Payment Proof
    const savedProof = sessionStorage.getItem('dwp_bps_payment_proof');
    if (savedProof) {
      setPaymentProofPreview(savedProof);
    }

    // Restore Active Screen
    const activeScreen = sessionStorage.getItem('dwp_bps_active_screen');
    const activeInvoice = sessionStorage.getItem('dwp_bps_active_invoice');
    const savedTime = sessionStorage.getItem('dwp_bps_order_time');
    const savedReceiptItems = sessionStorage.getItem('dwp_bps_receipt_items');
    if (activeScreen === 'receipt' && activeInvoice) {
      setInvoiceNo(activeInvoice);
      setOrderTime(savedTime || '');
      if (savedReceiptItems) {
        try {
          setReceiptItems(JSON.parse(savedReceiptItems));
        } catch (e) {
          console.error(e);
        }
      }
      setShowReceipt(true);
    }
  }, []);

  // Save drafts on change
  useEffect(() => {
    const draft = {
      panggilan,
      nama,
      whatsapp,
      hotel,
      kamar,
      province: selectedProvince,
      city: selectedCity,
      cashChecked: isAdminCashChecked
    };
    sessionStorage.setItem('dwp_bps_form_draft', JSON.stringify(draft));
  }, [nama, whatsapp, hotel, kamar, selectedProvince, selectedCity, isAdminCashChecked]);

  // Click outside to close dropdown handlers
  useEffect(() => {
    function handleClickOutside(event) {
      if (provRef.current && !provRef.current.contains(event.target)) {
        setShowProvDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        // Jangan tutup dropdown kota jika pengguna sedang mengklik dropdown provinsi
        if (provRef.current && provRef.current.contains(event.target)) {
          return;
        }
        setShowCityDropdown(false);
      }
      if (panggilanRef.current && !panggilanRef.current.contains(event.target)) {
        setShowPanggilanDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Autofill Action
  const handleAutofill = () => {
    const savedProfile = sessionStorage.getItem('dwp_bps_user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile) {
          if (profile.panggilan) setPanggilan(profile.panggilan);
          if (profile.nama) setNama(profile.nama);
          if (profile.whatsapp) setWhatsapp(profile.whatsapp);
          if (profile.hotel) setHotel(profile.hotel);
          if (profile.kamar) setKamar(profile.kamar);
          if (profile.province) {
            setSelectedProvince(profile.province);
            setProvQuery(profile.province.name);
          }
          if (profile.city) {
            setSelectedCity(profile.city);
            setCityQuery(profile.city.name);
          }
          showToast('Data diri berhasil diisi otomatis!', 'success');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Dropdown Province Select
  const handleSelectProvince = (prov) => {
    setSelectedProvince(prov);
    setProvQuery(prov.name);
    setShowProvDropdown(false);
    
    // Reset City
    setSelectedCity(null);
    setCityQuery('');
    
    // Bersihkan list kota dan set loading secara instan agar langsung muncul indikator "Memuat..."
    setCitiesList([]);
    setIsRegionsLoading(true);
    
    // Automatically open City dropdown list
    setShowCityDropdown(true);

    // Auto-focus input kota agar keyboard langsung muncul & list kota ter-render
    setTimeout(() => {
      if (cityInputRef.current) {
        cityInputRef.current.focus();
      }
    }, 100);
  };

  // Dropdown City Select
  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setCityQuery(city.name);
    setShowCityDropdown(false);
  };

  // Handle Payment Proof File Upload
  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('Harap unggah file gambar bukti pembayaran!', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB!', 'error');
      return;
    }

    setPaymentProofFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPaymentProofPreview(e.target.result);
      sessionStorage.setItem('dwp_bps_payment_proof', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-[#C19A6B]', 'bg-amber-50/10');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#C19A6B]', 'bg-amber-50/10');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#C19A6B]', 'bg-amber-50/10');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const resetFileUpload = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setPaymentProofFile(null);
    setPaymentProofPreview(null);
    sessionStorage.removeItem('dwp_bps_payment_proof');
  };

  const handleCopyBankAccount = (accountNumber) => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      showToast('Nomor rekening disalin ke clipboard!', 'success');
    }).catch(() => {
      showToast('Gagal menyalin nomor rekening.', 'error');
    });
  };

  // Submit Order Action
  const handleSubmitOrder = () => {
    if (!panggilan.trim()) {
      showToast('Pilih panggilan Bapak atau Ibu!', 'error');
      return;
    }
    if (!nama.trim()) {
      showToast('Nama Lengkap wajib diisi!', 'error');
      return;
    }
    if (!whatsapp.trim()) {
      showToast('Nomor WhatsApp wajib diisi!', 'error');
      return;
    }
    if (!selectedProvince) {
      showToast('Pilih Provinsi dari pilihan yang muncul!', 'error');
      return;
    }
    if (!selectedCity) {
      showToast('Pilih Kota / Kabupaten dari pilihan yang muncul!', 'error');
      return;
    }
    if (!hotel.trim()) {
      showToast('Nama Hotel wajib diisi!', 'error');
      return;
    }
    if (!kamar.trim()) {
      showToast('Nomor Kamar wajib diisi!', 'error');
      return;
    }

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    if (totalItems === 0) {
      showToast('Keranjang Anda kosong! Silakan pilih produk terlebih dahulu.', 'error');
      return;
    }

    if (activePaymentMethod !== 'cash' && !paymentProofPreview) {
      showToast('Bukti Pembayaran wajib diunggah!', 'error');
      return;
    }

    // Process payment loading
    setIsSubmitting(true);
    showToast('Memproses pesanan...', 'success');

    const generateInvoiceNo = () => {
      const date = new Date();
      const yy = String(date.getFullYear()).slice(-2);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let rand = '';
      for (let i = 0; i < 7; i++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `DWP-${yy}${mm}${dd}-${rand}`;
    };

    const inv = generateInvoiceNo();
    const now = new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    setTimeout(() => {
      // Save profile
      const userProfile = {
        panggilan,
        nama,
        whatsapp,
        province: selectedProvince,
        city: selectedCity,
        hotel,
        kamar
      };
      sessionStorage.setItem('dwp_bps_user_profile', JSON.stringify(userProfile));
      sessionStorage.setItem('dwp_bps_active_invoice', inv);
      sessionStorage.setItem('dwp_bps_active_screen', 'receipt');
      sessionStorage.setItem('dwp_bps_order_time', formattedDateTime);
      sessionStorage.setItem('dwp_bps_receipt_items', JSON.stringify(cartItems));

      setReceiptItems(cartItems);
      setInvoiceNo(inv);
      setOrderTime(formattedDateTime);
      setShowReceipt(true);
      setIsSubmitting(false);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  // Receipt download as JPG
  const handleDownloadJpg = () => {
    const receiptElement = document.getElementById('receipt-card-element');
    if (!receiptElement) return;

    showToast('Menyiapkan gambar struk...', 'success');
    
    htmlToImage.toJpeg(receiptElement, { quality: 0.95, backgroundColor: '#ffffff', pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Receipt-${invoiceNo}.jpg`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.open(dataUrl, '_blank');
        showToast('Struk berhasil diunduh!', 'success');
      })
      .catch((err) => {
        console.error('Gagal memproses gambar struk:', err);
        showToast('Gagal memproses gambar struk. Coba browser lain.', 'error');
      });
  };

  // Back to Checkout (Keep Drafts)
  const handleBackToCheckout = () => {
    sessionStorage.setItem('dwp_bps_active_screen', 'checkout');
    setShowReceipt(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset checkout for new order
  const handlePesanLagi = () => {
    // Reset States
    setPanggilan('');
    setNama('');
    setWhatsapp('');
    setSelectedProvince(null);
    setSelectedCity(null);
    setProvQuery('');
    setCityQuery('');
    setHotel('');
    setKamar('');
    resetFileUpload();
    setIsAdminCashChecked(false);
    setActivePaymentMethod('qris');
    setReceiptItems([]);

    // Clear specific LocalStorage fields
    sessionStorage.setItem('dwp_bps_active_screen', 'checkout');
    sessionStorage.removeItem('dwp_bps_active_invoice');
    sessionStorage.removeItem('dwp_bps_form_draft');
    sessionStorage.removeItem('dwp_bps_payment_proof');
    sessionStorage.removeItem('dwp_bps_order_time');
    sessionStorage.removeItem('dwp_bps_receipt_items');

    // Clear cart in parent Dashboard
    onClearCart?.();

    setShowReceipt(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Admin cash toggle change
  const handleAdminCashChange = (e) => {
    const checked = e.target.checked;
    setIsAdminCashChecked(checked);
    if (checked) {
      setActivePaymentMethod('cash');
    } else {
      setActivePaymentMethod('qris');
    }
  };

  // Autocomplete filtering
  const filteredProvinces = provincesList.filter(p =>
    p.name.toLowerCase().includes(provQuery.toLowerCase())
  );

  const filteredCities = citiesList.filter(c =>
    c.name.toLowerCase().includes(cityQuery.toLowerCase())
  );

  // If receipt is active, render the receipt view
  if (showReceipt) {
    return (
      <div className="min-h-screen bg-[#FDF6F0] flex flex-col font-sans items-center py-8 px-4 pb-24">
        {/* Toast Alert */}
        {toast.show && (
          <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border text-sm font-medium transition-all ${
            toast.type === 'success' 
              ? 'bg-[#E8F8F5] text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {toast.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            )}
            <span>{toast.message}</span>
          </div>
        )}

        <div className="w-full max-w-md space-y-6">
          {/* Back navigation to Checkout */}
          <button
            onClick={handleBackToCheckout}
            className="px-4 py-2 bg-white hover:bg-amber-50/30 text-[#4A3222] border border-[#FFCBA4] rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            ← Kembali ke Checkout
          </button>

          {/* Receipt Card Element (Captured by html-to-image) */}
          <div
            id="receipt-card-element"
            className="bg-gradient-to-b from-white to-[#FFF8F0] rounded-3xl shadow-xl border border-[#FFCBA4]/40 p-6 sm:p-8 space-y-5 text-[#4A3222] relative overflow-hidden"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#FFCBA4] via-[#F29C5A] to-[#FFCBA4]"></div>

            {/* Title */}
            <div className="text-center pb-2 pt-2">
              <h2 className="font-black text-[#D97736] tracking-wide text-base sm:text-lg drop-shadow-sm">RECEIPT PEMBELIAN</h2>
            </div>

            {/* Delivered Info */}
            <div className="space-y-3.5 text-[11px] sm:text-xs">
              <div className="flex justify-between items-start leading-relaxed">
                <span className="text-slate-400 font-bold">Delivered at:</span>
                <div className="text-right text-[#4A3222] font-semibold space-y-0.5 max-w-[70%]">
                  <span className="block font-black text-sm text-[#4A3222]">{nama}</span>
                  <span className="block">{hotel}, Kamar No. {kamar}</span>
                  <span className="block">{selectedCity ? selectedCity.name : ''}, Prov. {selectedProvince ? selectedProvince.name : ''}</span>
                  <span className="block">Indonesia</span>
                </div>
              </div>

              {/* Waktu Order */}
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-400 font-bold">Waktu Order:</span>
                <span className="text-[#4A3222]">{orderTime}</span>
              </div>

              {/* Status Order */}
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-400 font-bold">Status Order:</span>
                <span className="text-[#4A3222]">Selesai</span>
              </div>
            </div>

            <div className="border-t-[1.5px] border-dashed border-[#F29C5A]/60 my-2"></div>

            {/* Center Info Box */}
            <div className="bg-[#FFFBF7] rounded-2xl p-4 text-center text-xs font-black text-[#4A3222] space-y-1.5 border border-[#F29C5A]/30 shadow-3xs">
              <p className="tracking-wide text-sm text-[#D97736]">{hotel.toUpperCase()}</p>
              <p className="font-semibold text-slate-500">{whatsapp}</p>
              <p className="font-semibold text-slate-500">Kamar No: {kamar}</p>
            </div>

            {/* Ref Code */}
            <div className="text-center font-extrabold text-xs text-[#D97736] tracking-wider my-3">
              Ref. {invoiceNo}
            </div>

            <div className="border-t-[1.5px] border-dashed border-[#F29C5A]/60 my-2"></div>

            {/* Items Table */}
            <div className="space-y-3 text-[11px] sm:text-xs">
              {currentItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4 text-[#4A3222] font-semibold">
                  <span className="flex-1 font-bold text-[#4A3222] text-left leading-tight">{item.nama}</span>
                  <span className="text-slate-400 font-bold min-w-8 text-center">{item.quantity}</span>
                  <span className="text-[#F29C5A] font-bold min-w-16 text-right">{(item.harga).toLocaleString('id-ID')}</span>
                  <span className="text-[#D97736] font-black min-w-20 text-right">{(item.harga * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="border-t-[1.5px] border-dashed border-[#F29C5A]/60 my-2"></div>

            {/* Subtotal, Biaya Pengiriman, Total */}
            <div className="space-y-2 text-[11px] sm:text-xs font-semibold text-slate-500">
              <div className="flex justify-between items-center gap-4">
                <span className="flex-1 text-slate-400 font-bold text-left">Subtotal</span>
                <span className="text-slate-400 font-bold min-w-8 text-center">{currentItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
                <span className="min-w-16 text-right"></span>
                <span className="text-[#4A3222] font-black min-w-20 text-right">{(currentSubtotal).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="flex-1 text-slate-400 font-bold text-left">Biaya Pengiriman</span>
                <span className="min-w-8 text-center"></span>
                <span className="min-w-16 text-right"></span>
                <span className="text-[#4A3222] font-bold min-w-20 text-right">0</span>
              </div>
              <div className="flex justify-between items-center gap-4 text-sm font-black text-[#4A3222] pt-1">
                <span className="flex-1 text-left">Total</span>
                <span className="min-w-8 text-center"></span>
                <span className="min-w-16 text-right"></span>
                <span className="text-base text-[#D97736] font-black min-w-20 text-right">{(currentTotal).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Stamp LUNAS */}
            <div className="flex justify-center pt-6 pb-2">
              <div className="transform rotate-[-8deg] border-4 border-double border-[#2ECC71] rounded-xl px-6 py-1.5 text-[#2ECC71] font-black tracking-[4px] text-lg bg-white select-none shadow-2xs">
                LUNAS
              </div>
            </div>

            {/* Payment proof image removed from the receipt layout to prevent html2canvas crashes.
                The uploaded file is still saved to localStorage/database for admin reference. */}
          </div>

          {/* Action Buttons (Bottom) - styled matches brown/white design */}
          <div className="flex gap-3">
            {/* Download JPG Button */}
            <button
              onClick={handleDownloadJpg}
              className="flex-1 py-3.5 px-4 bg-[#4A3222] hover:bg-[#3d2719] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download JPG
            </button>

            {/* Pesan Lagi Button */}
            <button
              onClick={handlePesanLagi}
              className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-[#4A3222] border border-[#4A3222] font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#4A3222]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Pesan Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form checkout view
  return (
    <div className="min-h-screen bg-[#FDF6F0] text-[#4A3222] font-sans pb-28">
      {/* Toast Alert */}
      {toast.show && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border text-sm font-medium transition-all ${
          toast.type === 'success' 
            ? 'bg-[#E8F8F5] text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ) : (
            <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Grid Checkout Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Back navigation */}
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-white hover:bg-amber-50/30 text-[#4A3222] border border-[#FFCBA4] rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          ← Kembali ke Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Buyer Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DCC4]/50 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-extrabold flex items-center gap-2 text-[#4A3222]">
                <svg className="w-5 h-5 text-[#4A3222]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Identitas Pembeli
              </h2>
              {role === 'Admin' && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-100 border border-amber-200 text-amber-800 rounded-full flex items-center gap-1">
                  Admin Mode
                  <button
                    onClick={() => {
                      setRole('Guest');
                      localStorage.removeItem('user_role');
                      showToast('Logout dari Mode Admin', 'success');
                    }}
                    className="text-amber-800 font-bold hover:text-amber-950 ml-1 text-xs"
                    title="Keluar Admin Mode"
                  >
                    &times;
                  </button>
                </span>
              )}
            </div>

            {/* Autofill Button - Rounded-full, green border, green text */}
            {hasAutofillData && (
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={handleAutofill}
                  className="px-4 py-2 border border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-50/20 font-bold text-xs rounded-full transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                  </svg>
                  Gunakan data dari pesanan sebelumnya
                </button>
              </div>
            )}

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Panggilan */}
              <div className="space-y-1.5 relative" ref={panggilanRef}>
                <label className="block text-xs font-bold text-[#4A3222]">Panggilan <span className="text-rose-500">*</span></label>
                <div
                  onClick={() => setShowPanggilanDropdown(true)}
                  className="relative rounded-2xl border border-[#E5D3C0] bg-white focus-within:border-[#C19A6B] focus-within:ring-2 focus-within:ring-[#C19A6B]/15 transition-all flex items-center px-4 py-3 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#4A3222] mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="w-full text-xs font-semibold text-[#4A3222] bg-transparent outline-none border-none placeholder-[#A1887F]/75 p-0">
                    {panggilan || 'Pilih'}
                  </div>
                  <svg className={`w-4 h-4 text-[#4A3222] transition-transform ${showPanggilanDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {showPanggilanDropdown && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-40 bg-white border border-slate-200 rounded-2xl shadow-lg divide-y divide-slate-100 py-1">
                    {['Bapak', 'Ibu'].map(option => (
                      <div
                        key={option}
                        onClick={() => {
                          setPanggilan(option);
                          setShowPanggilanDropdown(false);
                        }}
                        className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50/70 hover:text-amber-900 cursor-pointer transition-colors"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A3222]">Nama Lengkap <span className="text-rose-500">*</span></label>
                <div className="relative rounded-2xl border border-[#E5D3C0] bg-white focus-within:border-[#C19A6B] focus-within:ring-2 focus-within:ring-[#C19A6B]/15 transition-all flex items-center px-4 py-3">
                  <svg className="w-4 h-4 text-[#4A3222] mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full text-xs font-semibold text-[#4A3222] bg-transparent outline-none border-none placeholder-[#A1887F]/75 p-0"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A3222]">Nomor WhatsApp <span className="text-rose-500">*</span></label>
                <div className="relative rounded-2xl border border-[#E5D3C0] bg-white focus-within:border-[#C19A6B] focus-within:ring-2 focus-within:ring-[#C19A6B]/15 transition-all flex items-center px-4 py-3">
                  <svg className="w-4 h-4 text-[#4A3222] mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    placeholder="Contoh: 081234567890"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs font-semibold text-[#4A3222] bg-transparent outline-none border-none placeholder-[#A1887F]/75 p-0"
                  />
                </div>
                <p className="text-[10px] text-[#A1887F] font-semibold leading-none pl-1">Digunakan untuk konfirmasi pesanan</p>
              </div>

              {/* Province & City selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Province Combobox */}
                <div className="space-y-1.5 relative" ref={provRef}>
                  <label className="block text-xs font-bold text-[#4A3222]">Provinsi <span className="text-rose-500">*</span></label>
                  <div
                    onClick={() => setShowProvDropdown(true)}
                    className="relative rounded-2xl border border-[#E5D3C0] bg-white focus-within:border-[#C19A6B] focus-within:ring-2 focus-within:ring-[#C19A6B]/15 transition-all flex items-center px-4 py-3 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#4A3222] mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Cari Provinsi..."
                      value={provQuery}
                      onChange={(e) => {
                        setProvQuery(e.target.value);
                        setSelectedProvince(null);
                        setSelectedCity(null);
                        setCityQuery('');
                        setShowProvDropdown(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          const match = provincesList.find(p => p.name.toLowerCase() === provQuery.toLowerCase());
                          if (match) {
                            handleSelectProvince(match);
                          } else {
                            const filtered = provincesList.filter(p => p.name.toLowerCase().includes(provQuery.toLowerCase()));
                            if (filtered.length === 1) {
                              handleSelectProvince(filtered[0]);
                            }
                          }
                        }, 250);
                      }}
                      className="w-full text-xs font-semibold text-[#4A3222] bg-transparent outline-none border-none placeholder-[#A1887F]/75 p-0 cursor-text"
                    />
                    <svg className={`w-4 h-4 text-[#4A3222] transition-transform ${showProvDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Province List Dropdown */}
                  {showProvDropdown && (
                    <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-40 bg-white border border-slate-200 rounded-2xl shadow-lg max-h-52 overflow-y-auto divide-y divide-slate-100 py-1">
                      {isRegionsLoading && provincesList.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-slate-400 font-semibold text-center italic">Memuat Provinsi...</div>
                      ) : filteredProvinces.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-slate-400 font-semibold text-center italic">Provinsi tidak ditemukan</div>
                      ) : (
                        filteredProvinces.map(p => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProvince(p)}
                            className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50/70 hover:text-amber-900 cursor-pointer transition-colors"
                          >
                            {p.name}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* City Combobox */}
                <div className="space-y-1.5 relative" ref={cityRef}>
                  <label className="block text-xs font-bold text-[#4A3222]">Kota <span className="text-rose-500">*</span></label>
                  <div
                    onClick={() => selectedProvince && setShowCityDropdown(true)}
                    className={`relative rounded-2xl border border-[#E5D3C0] bg-white focus-within:border-[#C19A6B] focus-within:ring-2 focus-within:ring-[#C19A6B]/15 transition-all flex items-center px-4 py-3 cursor-pointer ${!selectedProvince ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-4 h-4 text-[#4A3222] mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <input
                      type="text"
                      ref={cityInputRef}
                      disabled={!selectedProvince}
                      placeholder={selectedProvince ? "Cari Kota/Kabupaten..." : "Pilih Provinsi dahulu..."}
                      value={cityQuery}
                      onChange={(e) => {
                        setCityQuery(e.target.value);
                        setSelectedCity(null);
                        setShowCityDropdown(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          const match = citiesList.find(c => c.name.toLowerCase() === cityQuery.toLowerCase());
                          if (match) {
                            handleSelectCity(match);
                          } else {
                            const filtered = citiesList.filter(c => c.name.toLowerCase().includes(cityQuery.toLowerCase()));
                            if (filtered.length === 1) {
                              handleSelectCity(filtered[0]);
                            }
                          }
                        }, 250);
                      }}
                      className="w-full text-xs font-semibold text-[#4A3222] bg-transparent outline-none border-none placeholder-[#A1887F]/75 p-0 disabled:cursor-not-allowed cursor-text"
                    />
                    <svg className={`w-4 h-4 text-[#4A3222] transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* City List Dropdown */}
                  {showCityDropdown && selectedProvince && (
                    <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-40 bg-white border border-slate-200 rounded-2xl shadow-lg max-h-52 overflow-y-auto divide-y divide-slate-100 py-1">
                      {/* Write-In Custom Option */}
                      {cityQuery.trim().length > 0 && (
                        <div
                          onClick={() => handleSelectCity({
                            id: 'custom',
                            provinceId: selectedProvince.id,
                            name: cityQuery
                          })}
                          className="px-4 py-3 bg-[#FFFBF7] border-b border-slate-100 text-xs font-bold text-amber-900 hover:bg-amber-100/50 cursor-pointer flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Gunakan: <strong>"{cityQuery}"</strong></span>
                        </div>
                      )}

                      {isRegionsLoading && citiesList.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-slate-400 font-semibold text-center italic">Memuat Kota/Kabupaten...</div>
                      ) : citiesList.length === 0 ? (
                        <div className="px-4 py-3.5 text-xs text-amber-700 font-semibold text-center italic bg-amber-50/60 leading-normal">
                          ⚠️ Gagal mengambil data otomatis. Silakan ketik nama kota/kabupaten Anda secara manual di atas, lalu klik tombol "Gunakan" yang muncul.
                        </div>
                      ) : filteredCities.length === 0 && cityQuery.trim().length === 0 ? (
                        <div className="px-4 py-3 text-xs text-slate-400 font-semibold text-center italic">Ketik untuk mencari kota...</div>
                      ) : filteredCities.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-slate-400 font-semibold text-center italic">Kota tidak ditemukan</div>
                      ) : (
                        filteredCities.slice(0, 50).map(c => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectCity(c)}
                            className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50/70 hover:text-amber-900 cursor-pointer transition-colors"
                          >
                            {c.name}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Hotel & Room Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hotel */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4A3222]">Hotel Menginap <span className="text-rose-500">*</span></label>
                  <div className="relative rounded-2xl border border-[#E5D3C0] bg-white focus-within:border-[#C19A6B] focus-within:ring-2 focus-within:ring-[#C19A6B]/15 transition-all flex items-center px-4 py-3">
                    <svg className="w-4 h-4 text-[#4A3222] mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <input
                      type="text"
                      required
                      placeholder="Nama hotel/penginapan"
                      value={hotel}
                      onChange={(e) => setHotel(e.target.value)}
                      className="w-full text-xs font-semibold text-[#4A3222] bg-transparent outline-none border-none placeholder-[#A1887F]/75 p-0"
                    />
                  </div>
                </div>

                {/* Room */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#4A3222]">Nomor Kamar <span className="text-rose-500">*</span></label>
                  <div className="relative rounded-2xl border border-[#E5D3C0] bg-white focus-within:border-[#C19A6B] focus-within:ring-2 focus-within:ring-[#C19A6B]/15 transition-all flex items-center px-4 py-3">
                    <svg className="w-4 h-4 text-[#4A3222] mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2a2 2 0 002-2M9 12a3 3 0 11-6 0 3 3 0 016 0zm0 0h5m1.5 0h1.5m-3 0v3m3-3v3" />
                    </svg>
                    <input
                      type="text"
                      required
                      placeholder="No. kamar"
                      value={kamar}
                      onChange={(e) => setKamar(e.target.value)}
                      className="w-full text-xs font-semibold text-[#4A3222] bg-transparent outline-none border-none placeholder-[#A1887F]/75 p-0"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT: Cart Details & Payment */}
          <div className="lg:col-span-5 space-y-6">
            {/* Purchase Details Card */}
            <div className="bg-white rounded-3xl border border-[#E8DCC4]/50 shadow-xs p-6 space-y-5">
              <h2 className="text-base font-extrabold flex items-center gap-2 border-b border-slate-100 pb-4 text-[#4A3222]">
                <svg className="w-5 h-5 text-[#4A3222]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Keranjang & Rincian Pembelian
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 bg-[#FFFBF7] p-3 rounded-2xl border border-[#FFCBA4]/30 text-xs font-semibold">
                      <div className="space-y-1">
                        <p className="text-[#3c2a1e] font-bold text-xs">{item.nama}</p>
                        <p className="text-slate-500 font-medium">{formatRupiah(item.harga)} / pcs</p>
                      </div>
                      <div className="flex items-center gap-2.5 bg-white border border-[#FFCBA4] px-2.5 py-1 rounded-xl shadow-2xs">
                        <button
                          type="button"
                          onClick={() => onRemoveFromCart?.(item.id)}
                          className="w-5 h-5 flex items-center justify-center font-bold text-amber-700 hover:bg-amber-50 active:bg-amber-100 rounded-md transition-colors text-sm"
                        >
                          -
                        </button>
                        <span className="text-[#3c2a1e] font-extrabold min-w-4 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onAddToCart?.(item)}
                          className="w-5 h-5 flex items-center justify-center font-bold text-amber-700 hover:bg-amber-50 active:bg-amber-100 rounded-md transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-bold text-slate-400 italic text-center py-6">Keranjang kosong</p>
                )}
              </div>

              <div className="border-t border-dashed border-[#E5D3C0] pt-4 space-y-2 text-xs font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#4A3222] font-bold">{formatRupiah(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Diskon DWP (Promo)</span>
                    <span>-{formatRupiah(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Biaya Layanan</span>
                  <span className="text-emerald-600 font-extrabold">GRATIS</span>
                </div>
                <div className="flex justify-between items-center text-sm font-extrabold text-[#4A3222] border-t border-slate-100 pt-3 mt-1">
                  <span>Total Harga</span>
                  <span className="text-base text-amber-700 font-black">{formatRupiah(total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl border border-[#E8DCC4]/50 shadow-xs p-6 space-y-5">
              <h2 className="text-base font-extrabold flex items-center gap-2 border-b border-slate-100 pb-4 text-[#4A3222]">
                <svg className="w-5 h-5 text-[#4A3222]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Metode Pembayaran
              </h2>

              {/* Admin Cash Toggle */}
              {role === 'Admin' && (
                <div className="bg-[#FFFBF7] border border-[#FFCBA4]/45 p-3.5 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4A3222] flex items-center gap-1.5">
                    <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Bayar Tunai / Cash (COD)
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAdminCashChecked}
                      onChange={handleAdminCashChange}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              )}

              {/* Payment Tabs */}
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isAdminCashChecked}
                  onClick={() => setActivePaymentMethod('qris')}
                  className={`flex-1 py-3 px-3 rounded-2xl border font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    activePaymentMethod === 'qris'
                      ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m0 11v1m0-6v1m0-6h.01M12 12h.01M12 17h.01M3 6h4M3 10h4M3 14h4M3 18h4M7 6v12M17 6h4M17 10h4M17 14h4M17 18h4M21 6v12" /></svg>
                  QRIS
                </button>
                <button
                  type="button"
                  disabled={isAdminCashChecked}
                  onClick={() => setActivePaymentMethod('transfer')}
                  className={`flex-1 py-3 px-3 rounded-2xl border font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    activePaymentMethod === 'transfer'
                      ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h1v11H4V10zm5 0h1v11H9V10zm5 0h1v11h-1V10zm5 0h1v11h-1V10z" /></svg>
                  Transfer Bank
                </button>
              </div>

              {/* Payment Details Container */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 min-h-[120px] flex items-center justify-center">
                {/* QRIS CONTENT */}
                {activePaymentMethod === 'qris' && (
                  <div className="w-full flex flex-col items-center text-center space-y-4 py-2">
                    <div className="font-extrabold text-sm tracking-wide">
                      <span className="text-blue-600">Q</span>
                      <span className="text-red-500">R</span>
                      <span className="text-blue-600">I</span>
                      <span className="text-red-500">S</span>
                      <span className="text-slate-400 font-bold text-[9px] ml-1 bg-slate-200 px-1 py-0.5 rounded">GPN</span>
                    </div>
                    {/* Simulated QR Code */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs relative w-36 h-36 flex items-center justify-center select-none">
                      <div className="w-30 h-30 grid grid-cols-5 gap-1.5 p-1 relative">
                        {/* Top-Left Corner Box */}
                        <div className="border-[3px] border-black w-5 h-5 absolute top-0 left-0"></div>
                        {/* Top-Right Corner Box */}
                        <div className="border-[3px] border-black w-5 h-5 absolute top-0 right-0"></div>
                        {/* Bottom-Left Corner Box */}
                        <div className="border-[3px] border-black w-5 h-5 absolute bottom-0 left-0"></div>
                        {/* Center DWP label */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-600 border-2 border-white rounded-md text-white font-black text-[9px] px-1 shadow-2xs z-10">
                          DWP
                        </div>
                        {/* Simulated noise pixels */}
                        <div className="w-full h-full opacity-80 grid grid-cols-6 gap-1">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-[1px] ${
                                (i * 7 + 13) % 5 === 0 || (i * 3 + 1) % 4 === 0 
                                  ? 'bg-black' 
                                  : 'bg-transparent'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed max-w-xs">
                      Pindai kode QRIS di atas untuk melakukan pembayaran cepat melalui M-Banking or E-Wallet pilihan Anda.
                    </p>
                  </div>
                )}

                {/* TRANSFER BANK CONTENT */}
                {activePaymentMethod === 'transfer' && (
                  <div className="w-full space-y-3.5">
                    {/* Mandiri */}
                    <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="space-y-1 text-xs font-semibold">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-bold text-[9px] uppercase tracking-wider">Mandiri</span>
                        <p className="font-extrabold text-[#3c2a1e] tracking-wide text-xs">124-00-0987654-3</p>
                        <p className="text-[10px] text-slate-400 font-medium">a.n Dharma Wanita Persatuan BPS</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyBankAccount('1240009876543')}
                        className="px-2.5 py-1.5 text-slate-600 hover:text-amber-800 hover:bg-amber-50 active:bg-amber-100 rounded-xl transition-colors border border-slate-200 flex items-center gap-1 text-[10px] font-bold"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
                        Salin
                      </button>
                    </div>

                    {/* BRI */}
                    <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="space-y-1 text-xs font-semibold">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-bold text-[9px] uppercase tracking-wider">BRI</span>
                        <p className="font-extrabold text-[#3c2a1e] tracking-wide text-xs">0341-01-000234-56-7</p>
                        <p className="text-[10px] text-slate-400 font-medium">a.n Dharma Wanita Persatuan BPS</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyBankAccount('034101000234567')}
                        className="px-2.5 py-1.5 text-slate-600 hover:text-amber-800 hover:bg-amber-50 active:bg-amber-100 rounded-xl transition-colors border border-slate-200 flex items-center gap-1 text-[10px] font-bold"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
                        Salin
                      </button>
                    </div>
                  </div>
                )}

                {/* CASH CONTENT */}
                {activePaymentMethod === 'cash' && (
                  <div className="w-full py-4 text-center space-y-2 text-[#3c2a1e]">
                    <span className="text-3xl">💵</span>
                    <h4 className="font-extrabold text-sm">Bayar Tunai / COD</h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed max-w-xs mx-auto">
                      Pembayaran dilakukan secara tunai langsung di lokasi bazar atau Cash On Delivery saat serah terima produk. Anda tidak wajib mengunggah bukti pembayaran.
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Section (Hidden for Cash) */}
              {activePaymentMethod !== 'cash' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">Bukti Pembayaran <span className="text-rose-500">*</span></label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="border-2 border-dashed border-[#E5D3C0] rounded-3xl p-6 text-center cursor-pointer hover:border-[#C19A6B] hover:bg-amber-50/10 transition-all flex flex-col items-center justify-center space-y-1 relative"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => e.target.files.length > 0 && handleFile(e.target.files[0])}
                      className="hidden"
                    />

                    {paymentProofPreview ? (
                      <div className="w-full relative flex flex-col items-center space-y-3" onClick={(e) => e.stopPropagation()}>
                        <div className="w-full aspect-video max-h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                          <img
                            src={paymentProofPreview}
                            alt="Bukti Bayar Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={resetFileUpload}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] rounded-xl transition-colors shadow-2xs flex items-center gap-1"
                        >
                          Hapus Bukti
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-amber-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-xs font-bold text-slate-700">Klik untuk upload atau seret file ke sini</p>
                        <p className="text-[9px] text-slate-400 font-semibold">Format: JPG, JPEG, PNG (Maks. 5MB)</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Complete Order Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitOrder}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    Selesaikan Pemesanan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
