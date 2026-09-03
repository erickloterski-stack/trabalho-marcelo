const botaoVerTodos = document.getElementById('vertudo');

botaoVerTodos.addEventListener('click', () => {
    window.location.href = 'catalogo.html';
});

const botaoConfira1 = document.getElementById('confira_1');

botaoConfira1.addEventListener('click', () => {
    window.location.href = 'catalogo.html#offroad';
});

const botaoConfira2 = document.getElementById('confira_2');

botaoConfira2.addEventListener('click', () => {
    window.location.href = 'catalogo.html#casual';
});

const botaoConfira3 = document.getElementById('confira_3');

botaoConfira3.addEventListener('click', () => {
    window.location.href = 'catalogo.html#esportiva';
});

const botaoperfil = document.getElementById('perfil');

botaoperfil.addEventListener('click', () => {
    window.location.href = 'contato.html';
});

const botaovolta = document.getElementById('logo');

botaovolta.addEventListener('click', () => {
    window.location.href = 'catalogo.html';
});



const EMAILJS_PUBLIC_KEY = "0CTlHQqN3DdcLcG8Z";
const EMAILJS_SERVICE_ID = "service_g4sx7am";
const EMAILJS_TEMPLATE_ID = "template_su7g8tj";
const DESTINATARIO = "marcelo.micalowski@escola.pr.gov.br";
const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const statusMessage = document.getElementById("statusMessage");
const charCount = document.getElementById("charCount");
const messageField = document.getElementById("message");
const fields = {
    from_name: {
        errorId: "err-name",
        validators: [
            { test: (v) => v.length > 0, msg: "Nome é obrigatório." },
            { test: (v) => v.length >= 3, msg: "Nome deve ter pelo menos 3 caracteres." }
        ]
    },
    from_email: {
        errorId: "err-email",
        validators: [
            { test: (v) => v.length > 0, msg: "E-mail é obrigatório." },
            { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: "Informe um e-mail válido." }
        ]
    },
    subject: {
        errorId: "err-subject",
        validators: [
            { test: (v) => v.length > 0, msg: "Assunto é obrigatório." },
            { test: (v) => v.length >= 5, msg: "Assunto deve ter pelo menos 5 caracteres." }
        ]
    },
    message: {
        errorId: "err-message",
        validators: [
            { test: (v) => v.length > 0, msg: "Mensagem é obrigatória." },
            { test: (v) => v.length >= 10, msg: "Mensagem deve ter pelo menos 10 caracteres." }
        ]
    }
};
if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

function getField(id) {
    return document.getElementById(id);
}
function setStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = "status-message";
    if (message) {
        statusMessage.classList.add(type);
    }
}
function updateCharCount() {
    charCount.textContent = `${messageField.value.length}/1000 caracteres`;
}
function clearFieldState(fieldId) {
    const field = getField(fieldId);
    const errorEl = getField(fields[fieldId].errorId);
    field.classList.remove("valid", "invalid");
    errorEl.textContent = "";
}
function validateField(fieldId) {
    const field = getField(fieldId);
    const errorEl = getField(fields[fieldId].errorId);
    const value = field.value.trim();
    for (const rule of fields[fieldId].validators) {
        if (!rule.test(value)) {
            field.classList.add("invalid");
            field.classList.remove("valid");
            errorEl.textContent = rule.msg;
            return false;
        }
    }
    field.classList.remove("invalid");
    field.classList.add("valid");
    errorEl.textContent = "";
    return true;
}
function validateAll() {
    return Object.keys(fields).every(validateField);

}
function resetForm() {
    form.reset();
    Object.keys(fields).forEach(clearFieldState);
    updateCharCount();
    setStatus("");
}
Object.keys(fields).forEach((fieldId) => {
    const field = getField(fieldId);
    field.addEventListener("input", () => {
        validateField(fieldId);
        if (fieldId === "message") updateCharCount();
        if (statusMessage.textContent) setStatus("");
    });
    field.addEventListener("blur", () => {
        validateField(fieldId);
    });
});
clearBtn.addEventListener("click", () => {
    const hasData =
        getField("from_name").value.trim() ||
        getField("from_email").value.trim() ||
        getField("phone").value.trim() ||
        getField("subject").value.trim() ||
        getField("message").value.trim();
    if (!hasData) {
        resetForm();
        return;
    }
    const confirmed = window.confirm("Limpar todos os campos?");
    if (confirmed) {
        resetForm();
    }
});
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    if (!window.emailjs) {
        setStatus("EmailJS não foi carregado. Verifique o script da biblioteca.", "error");
        return;
    }
    if (!validateAll()) {
        setStatus("Revise os campos destacados antes de enviar.", "error");
        return;
    }
    sendBtn.disabled = true;
    sendBtn.classList.add("loading");
    const templateParams = {
        from_name: getField("from_name").value.trim(),
        from_email: getField("from_email").value.trim(),
        phone: getField("phone").value.trim() || "Não informado",
        subject: getField("subject").value.trim(),
        message: getField("message").value.trim(),
        to_email: DESTINATARIO,
        reply_to: getField("from_email").value.trim()
    };
    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        resetForm();
        setStatus("Mensagem enviada com sucesso. Entraremos em contato em breve.", "success");
    } catch (error) {
        console.error("Erro ao enviar:", error);
        setStatus("Erro ao enviar a mensagem. Verifique a configuração do EmailJS.", "error");
    } finally {
        sendBtn.disabled = false;
        sendBtn.classList.remove("loading");
    }
});
updateCharCount();