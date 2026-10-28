
/* ==========================================
   MEDICARE - MOBILE NAVIGATION
========================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Open and close mobile menu
menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close menu after clicking a navigation link
document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

// Initialize Lucide icons
if (window.lucide) {
    lucide.createIcons();
}


/* ==========================================
   MEDICARE - DOCTOR DATA
========================================== */

// Temporary doctor data
// Later, this can come from MongoDB.

const doctors = [
    {
        id: 1,
        name: "Dr. Sarah Perera",
        specialty: "Cardiology",
        location: "Colombo",
        experience: "8 years",
        image: "assets/images/doctors/doctor-1.jpg"
    },
    {
        id: 2,
        name: "Dr. Nimal Fernando",
        specialty: "Neurology",
        location: "Kandy",
        experience: "12 years",
        image: "assets/images/doctors/doctor-2.jpg"
    },
    {
        id: 3,
        name: "Dr. Amaya Silva",
        specialty: "Pediatrics",
        location: "Galle",
        experience: "6 years",
        image: "assets/images/doctors/doctor-3.jpg"
    },
    {
        id: 4,
        name: "Dr. Kavindu Jayasinghe",
        specialty: "Orthopedics",
        location: "Colombo",
        experience: "10 years",
        image: "assets/images/doctors/doctor-4.jpg"
    },
    {
        id: 5,
        name: "Dr. Anjali Fernando",
        specialty: "General Medicine",
        location: "Negombo",
        experience: "7 years",
        image: "assets/images/doctors/doctor-5.jpg"
    },
    {
        id: 6,
        name: "Dr. Ruwan Wijesinghe",
        specialty: "Cardiology",
        location: "Kandy",
        experience: "9 years",
        image: "assets/images/doctors/doctor-6.jpg"
    }
];


/* ==========================================
   DISPLAY DOCTOR CARDS
========================================== */

const doctorsGrid = document.getElementById("doctorsGrid");
const doctorsEmpty = document.getElementById("doctorsEmpty");

function displayDoctors(doctorList) {
    doctorsGrid.innerHTML = "";

    if (doctorList.length === 0) {
        doctorsEmpty.hidden = false;
        return;
    }

    doctorsEmpty.hidden = true;

    doctorList.forEach((doctor) => {
        const card = document.createElement("div");
        card.className = "doctor-card";

        card.innerHTML = `
            <div class="doctor-card-image">
                <img
                    src="${doctor.image}"
                    alt="Sample portrait of ${doctor.name}"
                    loading="lazy"
                >
            </div>

            <div class="doctor-card-content">
                <h3>${doctor.name}</h3>

                <p class="doctor-specialty">
                    ${doctor.specialty}
                </p>

                <p class="doctor-location">
                    <i data-lucide="map-pin"></i>
                    ${doctor.location}
                </p>

                <button
                    class="doctor-profile-btn"
                    type="button"
                    data-doctor-id="${doctor.id}"
                >
                    View Profile
                </button>
            </div>
        `;

        const image = card.querySelector("img");

        image.addEventListener("error", () => {
            image.onerror = null;
            image.src =
                "https://placehold.co/400x300/e8f5f3/10676c?text=Doctor";
        });

        doctorsGrid.appendChild(card);
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

// Display all doctors
displayDoctors(doctors);


/* ==========================================
   DOCTOR SEARCH AND FILTERING
========================================== */

const doctorSearch = document.getElementById("doctorSearch");
const specialtyFilter = document.getElementById("specialtyFilter");
const locationFilter = document.getElementById("locationFilter");

function filterDoctors() {
    const searchValue = doctorSearch.value.trim().toLowerCase();
    const specialtyValue = specialtyFilter.value;
    const locationValue = locationFilter.value;

    const filteredDoctors = doctors.filter((doctor) => {
        const matchesName = doctor.name
            .toLowerCase()
            .includes(searchValue);

        const matchesSpecialty =
            specialtyValue === "" ||
            doctor.specialty === specialtyValue;

        const matchesLocation =
            locationValue === "" ||
            doctor.location === locationValue;

        return (
            matchesName &&
            matchesSpecialty &&
            matchesLocation
        );
    });

    displayDoctors(filteredDoctors);
}

doctorSearch.addEventListener("input", filterDoctors);
specialtyFilter.addEventListener("change", filterDoctors);
locationFilter.addEventListener("change", filterDoctors);


/* ==========================================
   DOCTOR PROFILE MODAL
========================================== */

const doctorModal = document.getElementById("doctorModal");
const closeDoctorModalBtn =
    document.getElementById("closeDoctorModal");

const modalDoctorImage =
    document.getElementById("modalDoctorImage");

const modalDoctorName =
    document.getElementById("modalDoctorName");

const modalDoctorSpecialty =
    document.getElementById("modalDoctorSpecialty");

const modalDoctorLocation =
    document.getElementById("modalDoctorLocation");

const modalDoctorExperience =
    document.getElementById("modalDoctorExperience");

let lastFocusedElement = null;
let selectedDoctor = null;

// Open doctor profile
function openDoctorProfile(doctorId) {
    const doctor = doctors.find(
        (doctor) => String(doctor.id) === String(doctorId)
    );

    if (!doctor) return;

    selectedDoctor = doctor;
    lastFocusedElement = document.activeElement;

    modalDoctorImage.src = doctor.image;
    modalDoctorImage.alt = `Portrait of ${doctor.name}`;

    modalDoctorName.textContent = doctor.name;
    modalDoctorSpecialty.textContent = doctor.specialty;
    modalDoctorLocation.textContent =
        `Location: ${doctor.location}`;
    modalDoctorExperience.textContent =
        `Experience: ${doctor.experience}`;

    doctorModal.hidden = false;
    document.body.style.overflow = "hidden";

    closeDoctorModalBtn.focus();
}

// Close doctor profile
function closeDoctorProfile() {
    doctorModal.hidden = true;
    document.body.style.overflow = "";

    selectedDoctor = null;

    if (
        lastFocusedElement &&
        lastFocusedElement.isConnected
    ) {
        lastFocusedElement.focus();
    }

    lastFocusedElement = null;
}

// Handle profile button clicks
doctorsGrid.addEventListener("click", (event) => {
    const profileButton = event.target.closest(
        ".doctor-profile-btn"
    );

    if (!profileButton) return;

    const doctorId = profileButton.dataset.doctorId;

    openDoctorProfile(doctorId);
});

// Close profile using X button
closeDoctorModalBtn.addEventListener(
    "click",
    closeDoctorProfile
);

// Close by clicking outside
doctorModal.addEventListener("click", (event) => {
    if (event.target === doctorModal) {
        closeDoctorProfile();
    }
});


/* ==========================================
   APPOINTMENT FORM FUNCTIONALITY
========================================== */

const appointmentModal =
    document.getElementById("appointmentModal");

const closeAppointmentModalBtn =
    document.getElementById("closeAppointmentModal");

const requestAppointmentBtn =
    document.getElementById("requestAppointmentBtn");

const appointmentForm =
    document.getElementById("appointmentForm");

const appointmentDoctor =
    document.getElementById("appointmentDoctor");

const appointmentDate =
    document.getElementById("appointmentDate");

const appointmentFeedback =
    document.getElementById("appointmentFeedback");

const patientNameInput =
    document.getElementById("patientName");

const patientEmailInput =
    document.getElementById("patientEmail");

const patientPhoneInput =
    document.getElementById("patientPhone");

const appointmentMessageInput =
    document.getElementById("appointmentMessage");

const appointmentSubmitBtn =
    appointmentForm.querySelector('[type="submit"]');

const API_URL = "http://localhost:5000/api/appointments";

let appointmentReturnFocus = null;

// IMPORTANT:
// Keep the doctor selected while the appointment form is open.
let appointmentSelectedDoctor = null;

let isSubmittingAppointment = false;


// Get today's local date
function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Display appointment feedback
function showAppointmentFeedback(message, isError = false) {
    appointmentFeedback.textContent = message;
    appointmentFeedback.classList.toggle("error", isError);
    appointmentFeedback.hidden = false;
}


// Display error
function showAppointmentError(message) {
    showAppointmentFeedback(message, true);
}


// Clear feedback
function clearAppointmentError() {
    appointmentFeedback.textContent = "";
    appointmentFeedback.classList.remove("error");
    appointmentFeedback.hidden = true;
}


// Open appointment form
function openAppointmentForm() {
    if (!selectedDoctor) return;

    // Save selected doctor before closing profile
    appointmentSelectedDoctor = selectedDoctor;

    // Save original focus position
    appointmentReturnFocus = lastFocusedElement;

    // Reset form
    appointmentForm.reset();
    clearAppointmentError();

    // Automatically fill selected doctor
    appointmentDoctor.value =
        appointmentSelectedDoctor.name;

    // Prevent past dates
    appointmentDate.min = getTodayDate();

    // Close doctor profile
    doctorModal.hidden = true;

    selectedDoctor = null;
    lastFocusedElement = null;

    // Open appointment form
    appointmentModal.hidden = false;
    document.body.style.overflow = "hidden";

    closeAppointmentModalBtn.focus();
}


// Close appointment form
function closeAppointmentForm() {
    if (isSubmittingAppointment) return;

    appointmentModal.hidden = true;
    document.body.style.overflow = "";

    appointmentSelectedDoctor = null;

    if (
        appointmentReturnFocus &&
        appointmentReturnFocus.isConnected
    ) {
        appointmentReturnFocus.focus();
    }

    appointmentReturnFocus = null;
}


// Open appointment modal
requestAppointmentBtn.addEventListener(
    "click",
    openAppointmentForm
);


// Close appointment modal
closeAppointmentModalBtn.addEventListener(
    "click",
    closeAppointmentForm
);


// Close when clicking outside
appointmentModal.addEventListener("click", (event) => {
    if (event.target === appointmentModal) {
        closeAppointmentForm();
    }
});


/* ==========================================
   MODAL KEYBOARD ACCESSIBILITY
========================================== */

// Handle Escape and Tab for both modals
document.addEventListener("keydown", (event) => {
    let activeModal = null;

    if (!appointmentModal.hidden) {
        activeModal = appointmentModal;
    } else if (!doctorModal.hidden) {
        activeModal = doctorModal;
    }

    if (!activeModal) return;

    if (event.key === "Escape") {
        if (activeModal === appointmentModal) {
            if (!isSubmittingAppointment) {
                closeAppointmentForm();
            }
        } else {
            closeDoctorProfile();
        }

        return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
        activeModal.querySelectorAll(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
        )
    ).filter(
        (element) => element.getClientRects().length > 0
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement =
        focusableElements[focusableElements.length - 1];

    if (
        event.shiftKey &&
        document.activeElement === firstElement
    ) {
        event.preventDefault();
        lastElement.focus();
    } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
    ) {
        event.preventDefault();
        firstElement.focus();
    }
});


/* ==========================================
   APPOINTMENT FORM VALIDATION + API
========================================== */

appointmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Prevent duplicate submissions
    if (isSubmittingAppointment) return;

    clearAppointmentError();

    const patientName = patientNameInput.value.trim();
    const patientEmail = patientEmailInput.value.trim();
    const patientPhone = patientPhoneInput.value.trim();
    const preferredDate = appointmentDate.value;

    const appointmentMessage =
        appointmentMessageInput
            ? appointmentMessageInput.value.trim()
            : "";

    // Validate selected doctor
    if (!appointmentSelectedDoctor) {
        showAppointmentError(
            "Please select a doctor before requesting an appointment."
        );
        return;
    }

    // Validate patient name
    if (patientName.length < 2) {
        showAppointmentError(
            "Please enter a valid full name (at least 2 characters)."
        );
        return;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(patientEmail)) {
        showAppointmentError(
            "Please enter a valid email address."
        );
        return;
    }

    // Validate Sri Lankan phone number
    const phonePattern = /^(?:0\d{9}|\+94\d{9})$/;

    const cleanedPhone =
        patientPhone.replace(/[\s-]/g, "");

    if (!phonePattern.test(cleanedPhone)) {
        showAppointmentError(
            "Please enter a valid Sri Lankan phone number."
        );
        return;
    }

    // Validate appointment date
    if (!preferredDate) {
        showAppointmentError(
            "Please select your preferred appointment date."
        );
        return;
    }

    if (preferredDate < getTodayDate()) {
        showAppointmentError(
            "Please select today or a future date."
        );
        return;
    }

    // Prepare appointment data for backend
    const appointmentData = {
        doctorId: appointmentSelectedDoctor.id,
        doctorName: appointmentSelectedDoctor.name,
        patientName: patientName,
        patientEmail: patientEmail,
        patientPhone: cleanedPhone,
        appointmentDate: preferredDate,
        message: appointmentMessage
    };

    // Start submission
    isSubmittingAppointment = true;

    const originalButtonText =
        appointmentSubmitBtn
            ? appointmentSubmitBtn.textContent
            : "";

    if (appointmentSubmitBtn) {
        appointmentSubmitBtn.disabled = true;
        appointmentSubmitBtn.textContent = "Submitting...";
    }

    showAppointmentFeedback(
        "Submitting your appointment request..."
    );

    try {
        // Send appointment to Express backend
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentData)
        });

        // Read backend response
        const result = await response.json();

        // Handle unsuccessful response
        if (!response.ok || result.success === false) {
            throw new Error(
                result.message ||
                "Unable to submit appointment request."
            );
        }

        // Appointment saved successfully
        showAppointmentFeedback(
            "Appointment request submitted successfully! Your request is pending confirmation."
        );

        // Clear patient inputs
        appointmentForm.reset();

        // Keep doctor name visible
        appointmentDoctor.value =
            appointmentSelectedDoctor.name;

        appointmentDate.min = getTodayDate();

        console.log(
            "Appointment saved successfully:",
            result.appointment
        );

    } catch (error) {
        console.error(
            "Appointment submission error:",
            error
        );

        if (error instanceof TypeError) {
            showAppointmentError(
                "Unable to connect to the server. Please make sure the MediCare backend is running."
            );
        } else {
            showAppointmentError(
                error.message ||
                "Something went wrong. Please try again."
            );
        }

    } finally {
        // Allow another submission
        isSubmittingAppointment = false;

        if (appointmentSubmitBtn) {
            appointmentSubmitBtn.disabled = false;
            appointmentSubmitBtn.textContent =
                originalButtonText;
        }
    }
});


/* ==========================================
   REFRESH LUCIDE ICONS
========================================== */

if (window.lucide) {
    lucide.createIcons();
}


/* =========================================
   CONTACT FORM SUBMISSION
========================================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    const contactSubmitBtn = document.getElementById("contactSubmitBtn");
    const contactFeedback = document.getElementById("contactFeedback");

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);

        const contactData = {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            subject: String(formData.get("subject") || "").trim(),
            message: String(formData.get("message") || "").trim()
        };

        // Prevent multiple submissions
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.textContent = "Sending...";

        contactFeedback.hidden = true;
        contactFeedback.textContent = "";

        try {
            const response = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to send message.");
            }

            // Show success message
            contactFeedback.textContent =
                result.message || "Your message has been sent successfully!";

            contactFeedback.style.color = "#16803c";
            contactFeedback.hidden = false;

            // Clear the form
            contactForm.reset();

        } catch (error) {
            console.error("Contact form error:", error);

            contactFeedback.textContent =
                error.message || "Something went wrong. Please try again.";

            contactFeedback.style.color = "#dc2626";
            contactFeedback.hidden = false;

        } finally {
            contactSubmitBtn.disabled = false;
            contactSubmitBtn.innerHTML =
                'Send Message <i data-lucide="send"></i>';

            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    });
}
