

const API_URL = "https://medicare-backend-zfwh.onrender.com/api/appointments";
const CONTACT_API_URL = "https://medicare-backend-zfwh.onrender.com/api/contact";


const token = sessionStorage.getItem("medicareAdminToken");

const tableBody = document.getElementById("appointmentsTableBody");
const dashboardMessage = document.getElementById("dashboardMessage");
const refreshButton = document.getElementById("refreshButton");
const logoutButton = document.getElementById("logoutButton");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const confirmedCount = document.getElementById("confirmedCount");
const cancelledCount = document.getElementById("cancelledCount");

const appointmentSearch = document.getElementById("appointmentSearch");
const statusFilter = document.getElementById("statusFilter");

let allAppointments = [];

// ==========================================
// APPOINTMENT DETAILS MODAL
// ==========================================

const appointmentModal = document.getElementById("appointmentModal");
const detailsModalCard = appointmentModal.querySelector(".details-modal-card");
const closeDetailsModalButton = document.getElementById("closeDetailsModal");
const doneDetailsButton = document.getElementById("doneDetailsButton");

let previousFocusedElement = null;

// ==========================================
// AUTHENTICATION
// ==========================================

function logout() {
    sessionStorage.removeItem("medicareAdminToken");
    window.location.replace("./login.html");
}

logoutButton.addEventListener("click", logout);

// ==========================================
// APPOINTMENT DETAILS MODAL
// ==========================================

function openAppointmentDetails(appointment) {
    previousFocusedElement = document.activeElement;

    document.getElementById("detailPatientName").textContent =
        appointment.patientName || "—";

    document.getElementById("detailDoctorName").textContent =
        appointment.doctorName || "—";

    document.getElementById("detailPatientEmail").textContent =
        appointment.patientEmail || "—";

    document.getElementById("detailPatientPhone").textContent =
        appointment.patientPhone || "—";

    document.getElementById("detailAppointmentDate").textContent =
        formatDate(appointment.appointmentDate);

    document.getElementById("detailAppointmentStatus").textContent =
        appointment.status || "—";

    document.getElementById("detailPatientMessage").textContent =
        appointment.message?.trim() || "No message provided.";

    appointmentModal.classList.add("is-open");
    appointmentModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    closeDetailsModalButton.focus();
}

function closeAppointmentDetails() {
    appointmentModal.classList.remove("is-open");
    appointmentModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (previousFocusedElement?.isConnected) {
        previousFocusedElement.focus();
    }
}

closeDetailsModalButton.addEventListener(
    "click",
    closeAppointmentDetails
);

doneDetailsButton.addEventListener(
    "click",
    closeAppointmentDetails
);

appointmentModal.addEventListener("click", (event) => {
    if (event.target === appointmentModal) {
        closeAppointmentDetails();
    }
});

document.addEventListener("keydown", (event) => {
    if (!appointmentModal.classList.contains("is-open")) {
        return;
    }

    if (event.key === "Escape") {
        closeAppointmentDetails();
    }

    if (event.key === "Tab") {
        const focusable = [
            closeDetailsModalButton,
            doneDetailsButton
        ];

        const currentIndex = focusable.indexOf(
            document.activeElement
        );

        if (event.shiftKey) {
            if (currentIndex <= 0) {
                event.preventDefault();
                focusable[focusable.length - 1].focus();
            }
        } else if (currentIndex === focusable.length - 1) {
            event.preventDefault();
            focusable[0].focus();
        }
    }
});

// ==========================================
// DISPLAY APPOINTMENT STATISTICS
// ==========================================

function updateStatistics(appointments) {
    totalCount.textContent = appointments.length;

    pendingCount.textContent = appointments.filter(
        appointment => appointment.status === "pending"
    ).length;

    confirmedCount.textContent = appointments.filter(
        appointment => appointment.status === "confirmed"
    ).length;

    cancelledCount.textContent = appointments.filter(
        appointment => appointment.status === "cancelled"
    ).length;
}

// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleDateString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "Asia/Colombo"
    });
}

// ==========================================
// DISPLAY APPOINTMENTS
// ==========================================

function displayAppointments(appointments) {
    tableBody.replaceChildren();

    if (appointments.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "empty-table";

        const searchTerm = appointmentSearch.value.trim();
        const selectedStatus = statusFilter.value;

        if (allAppointments.length === 0) {
            cell.textContent =
                "No appointments yet. New patient requests will appear here.";
        } else if (searchTerm || selectedStatus !== "all") {
            cell.textContent =
                "No appointments match your search or filter.";
        } else {
            cell.textContent = "No appointments found.";
        }

        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    appointments.forEach(appointment => {
        const row = document.createElement("tr");

        const patientCell = document.createElement("td");
        patientCell.textContent = appointment.patientName;

        const doctorCell = document.createElement("td");
        doctorCell.textContent = appointment.doctorName;

        const dateCell = document.createElement("td");
        dateCell.textContent = formatDate(
            appointment.appointmentDate
        );

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        const allowedStatuses = [
            "pending",
            "confirmed",
            "cancelled"
        ];

        const status = allowedStatuses.includes(appointment.status)
            ? appointment.status
            : "unknown";

        statusBadge.className = `status-badge status-${status}`;
        statusBadge.textContent = status;

        statusCell.appendChild(statusBadge);

        const actionCell = document.createElement("td");
        const actionContainer = document.createElement("div");
        actionContainer.className = "appointment-actions";

        const viewButton = document.createElement("button");

        viewButton.textContent = "View Details";
        viewButton.className = "action-btn view-btn";
        viewButton.type = "button";

        viewButton.addEventListener("click", () => {
            openAppointmentDetails(appointment);
        });

        actionContainer.appendChild(viewButton);

        // Confirm button
        if (appointment.status === "pending") {
            const confirmButton = document.createElement("button");

            confirmButton.textContent = "Confirm";
            confirmButton.className = "action-btn confirm-btn";
            confirmButton.type = "button";

            confirmButton.addEventListener("click", () => {
                updateAppointmentStatus(
                    appointment._id,
                    "confirmed",
                    actionContainer
                );
            });

            actionContainer.appendChild(confirmButton);
        }

        // Cancel button
        if (appointment.status !== "cancelled") {
            const cancelButton = document.createElement("button");

            cancelButton.textContent = "Cancel";
            cancelButton.className = "action-btn cancel-btn";
            cancelButton.type = "button";

            cancelButton.addEventListener("click", () => {
                updateAppointmentStatus(
                    appointment._id,
                    "cancelled",
                    actionContainer
                );
            });

            actionContainer.appendChild(cancelButton);
        }

        if (appointment.status === "cancelled") {
            const completedText = document.createElement("span");

            completedText.textContent = "No actions";
            completedText.className = "no-actions";

            actionContainer.appendChild(completedText);
        }

        actionCell.appendChild(actionContainer);

        row.append(
            patientCell,
            doctorCell,
            dateCell,
            statusCell,
            actionCell
        );

        tableBody.appendChild(row);
    });
}

// ==========================================
// SEARCH AND FILTER APPOINTMENTS
// ==========================================

function filterAppointments() {
    const searchTerm = appointmentSearch.value
        .trim()
        .toLowerCase();

    const selectedStatus = statusFilter.value;

    const filteredAppointments = allAppointments.filter(
        appointment => {
            const patientName = (
                appointment.patientName || ""
            ).toLowerCase();

            const doctorName = (
                appointment.doctorName || ""
            ).toLowerCase();

            const matchesSearch =
                patientName.includes(searchTerm) ||
                doctorName.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                appointment.status === selectedStatus;

            return matchesSearch && matchesStatus;
        }
    );

    displayAppointments(filteredAppointments);

    dashboardMessage.textContent =
        `Showing ${filteredAppointments.length} of ${allAppointments.length} appointment(s).`;
}

// ==========================================
// FETCH APPOINTMENTS FROM BACKEND
// ==========================================

function showTableMessage(message) {
    tableBody.replaceChildren();

    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.className = "empty-table";
    cell.textContent = message;

    row.appendChild(cell);
    tableBody.appendChild(row);
}

async function loadAppointments() {
    const currentToken = sessionStorage.getItem(
        "medicareAdminToken"
    );

    if (!currentToken) {
        logout();
        return;
    }

    refreshButton.disabled = true;
    refreshButton.textContent = "Loading...";
    dashboardMessage.textContent = "Loading appointments...";
    showTableMessage("Loading appointments...");

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${currentToken}`
            },
            cache: "no-store"
        });

        if (response.status === 401) {
            logout();
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load appointments."
            );
        }

        if (!Array.isArray(data.appointments)) {
            throw new Error("Invalid appointments response.");
        }

        allAppointments = data.appointments;

        updateStatistics(allAppointments);
        filterAppointments();

    } catch (error) {
        dashboardMessage.textContent =
            "Unable to load appointments. Please try again.";

        showTableMessage(
            "Something went wrong while loading appointments. Click Refresh to retry."
        );

        totalCount.textContent = "—";
        pendingCount.textContent = "—";
        confirmedCount.textContent = "—";
        cancelledCount.textContent = "—";

        allAppointments = [];

        console.error("Appointment loading error:", error);

    } finally {
        refreshButton.disabled = false;
        refreshButton.textContent = "Refresh";
    }
}

// ==========================================
// UPDATE APPOINTMENT STATUS
// ==========================================

async function updateAppointmentStatus(
    appointmentId,
    newStatus,
    actionContainer
) {
    const currentToken = sessionStorage.getItem(
        "medicareAdminToken"
    );

    if (!currentToken) {
        logout();
        return;
    }

    const actionText =
        newStatus === "confirmed" ? "confirm" : "cancel";

    const isConfirmed = window.confirm(
        `Are you sure you want to ${actionText} this appointment?`
    );

    if (!isConfirmed) {
        return;
    }

    const buttons = actionContainer.querySelectorAll("button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    dashboardMessage.textContent = "Updating appointment...";

    try {
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(appointmentId)}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentToken}`
                },
                body: JSON.stringify({
                    status: newStatus
                })
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to update appointment."
            );
        }

        await loadAppointments();

        dashboardMessage.textContent =
            `Appointment ${newStatus} successfully!`;

    } catch (error) {
        dashboardMessage.textContent = error.message;
        console.error("Appointment update error:", error);

    } finally {
        buttons.forEach(button => {
            button.disabled = false;
        });
    }
}

appointmentSearch.addEventListener("input", filterAppointments);
statusFilter.addEventListener("change", filterAppointments);


/* =========================================
   CONTACT MESSAGE DETAILS MODAL
========================================= */

const contactMessageModal = document.getElementById("contactMessageModal");
const closeContactModalBtn = document.getElementById("closeContactModal");
const doneContactModalBtn = document.getElementById("doneContactModal");

let previousContactFocus = null;

function openContactMessageModal(message) {
    previousContactFocus = document.activeElement;

    document.getElementById("contactDetailName").textContent =
        message.name || "—";

    document.getElementById("contactDetailEmail").textContent =
        message.email || "—";

    document.getElementById("contactDetailSubject").textContent =
        message.subject || "—";

    document.getElementById("contactDetailDate").textContent =
        message.createdAt ? formatDate(message.createdAt) : "—";

    document.getElementById("contactDetailMessage").textContent =
        message.message || "No message provided.";

    contactMessageModal.classList.add("is-open");
    contactMessageModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    closeContactModalBtn.focus();
}

function closeContactMessageModal() {
    contactMessageModal.classList.remove("is-open");
    contactMessageModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (previousContactFocus?.isConnected) {
        previousContactFocus.focus();
    }
}

closeContactModalBtn.addEventListener(
    "click",
    closeContactMessageModal
);

doneContactModalBtn.addEventListener(
    "click",
    closeContactMessageModal
);

contactMessageModal.addEventListener("click", (event) => {
    if (event.target === contactMessageModal) {
        closeContactMessageModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (!contactMessageModal.classList.contains("is-open")) {
        return;
    }

    if (event.key === "Escape") {
        closeContactMessageModal();
    }

    if (event.key === "Tab") {
        const focusable = [
            closeContactModalBtn,
            doneContactModalBtn
        ];

        const currentIndex = focusable.indexOf(
            document.activeElement
        );

        if (event.shiftKey && currentIndex <= 0) {
            event.preventDefault();
            doneContactModalBtn.focus();
        } else if (
            !event.shiftKey &&
            currentIndex === focusable.length - 1
        ) {
            event.preventDefault();
            closeContactModalBtn.focus();
        }
    }
});

// ==========================================
// ADMIN CONTACT MESSAGES
// ==========================================

const messagesTableBody = document.getElementById("messagesTableBody");
const messagesFeedback = document.getElementById("messagesFeedback");
const refreshMessagesBtn = document.getElementById("refreshMessagesBtn");

async function loadContactMessages() {
    if (!messagesTableBody) return;

    messagesTableBody.replaceChildren();

    const loadingRow = messagesTableBody.insertRow();
    const loadingCell = loadingRow.insertCell();

    loadingCell.colSpan = 6;
    loadingCell.textContent = "Loading messages...";

    if (messagesFeedback) {
        messagesFeedback.textContent = "";
    }

    if (refreshMessagesBtn) {
        refreshMessagesBtn.disabled = true;
        refreshMessagesBtn.textContent = "Loading...";
    }

    try {
        // FIX: Use the same token as the appointments dashboard
        const currentToken = sessionStorage.getItem(
            "medicareAdminToken"
        );

        if (!currentToken) {
            logout();
            return;
        }

        const response = await fetch(CONTACT_API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${currentToken}`
            },
            cache: "no-store"
        });

        if (response.status === 401) {
            logout();
            return;
        }

        if (response.status === 403) {
            throw new Error(
                "You do not have permission to view contact messages."
            );
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to load contact messages."
            );
        }

        if (!Array.isArray(data)) {
            throw new Error("Invalid contact messages response.");
        }

        messagesTableBody.replaceChildren();

        if (data.length === 0) {
            const row = messagesTableBody.insertRow();
            const cell = row.insertCell();

            cell.colSpan = 6;
            cell.textContent = "No contact messages yet.";
            return;
        }

        data.forEach(message => {
            const row = messagesTableBody.insertRow();

            const nameCell = row.insertCell();
            nameCell.textContent = message.name || "—";

            const emailCell = row.insertCell();
            emailCell.textContent = message.email || "—";

            const subjectCell = row.insertCell();
            subjectCell.textContent = message.subject || "—";

            const dateCell = row.insertCell();
            dateCell.textContent = message.createdAt
                ? formatDate(message.createdAt)
                : "—";

            const statusCell = row.insertCell();
            const statusBadge = document.createElement("span");

            const status = message.status === "read"
                ? "read"
                : "unread";

            statusBadge.textContent = status;
            statusBadge.className =
                `status-badge status-${status}`;

            statusCell.appendChild(statusBadge);

            const actionCell = row.insertCell();
            const viewButton = document.createElement("button");

            viewButton.type = "button";
            viewButton.textContent = "View Message";
            viewButton.className = "action-btn view-btn";



            viewButton.addEventListener("click", async () => {
                // Open the message immediately
                openContactMessageModal(message);

                // No update needed if already read
                if (message.status === "read") {
                    return;
                }

                const currentToken = sessionStorage.getItem(
                    "medicareAdminToken"
                );

                if (!currentToken) {
                    logout();
                    return;
                }

                try {
                    const response = await fetch(
                        `${CONTACT_API_URL}/${encodeURIComponent(message._id)}/read`,
                        {
                            method: "PATCH",
                            headers: {
                                Authorization: `Bearer ${currentToken}`
                            }
                        }
                    );

                    if (response.status === 401) {
                        logout();
                        return;
                    }

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            result.message || "Unable to mark message as read."
                        );
                    }

                    // Update local message status
                    message.status = "read";

                    // Update the status badge immediately
                    statusBadge.textContent = "read";
                    statusBadge.className = "status-badge status-read";

                } catch (error) {
                    console.error("Mark as read error:", error);

                    if (messagesFeedback) {
                        messagesFeedback.textContent =
                            "Message opened, but its read status could not be updated.";
                    }
                }
            });



            actionCell.appendChild(viewButton);
        });

        if (messagesFeedback) {
            messagesFeedback.textContent =
                `${data.length} contact message(s) found.`;
        }

    } catch (error) {
        console.error("Contact messages error:", error);

        messagesTableBody.replaceChildren();

        const row = messagesTableBody.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 6;
        cell.textContent = "Could not load messages.";

        if (messagesFeedback) {
            messagesFeedback.textContent = error.message;
        }

    } finally {
        if (refreshMessagesBtn) {
            refreshMessagesBtn.disabled = false;
            refreshMessagesBtn.textContent = "Refresh Messages";
        }
    }
}

// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

refreshButton.addEventListener("click", loadAppointments);

if (refreshMessagesBtn) {
    refreshMessagesBtn.addEventListener(
        "click",
        loadContactMessages
    );
}

if (token) {
    loadAppointments();
    loadContactMessages();
} else {
    logout();
}
