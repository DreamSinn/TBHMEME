// Conexão dinâmica com o backend em C# via Chrome WebView2 Host Object
const getBackend = () => window.chrome?.webview?.hostObjects?.sync?.trainerBackend;


// Ação de abrir a Wiki para consulta de IDs
document.getElementById("btnViewItems").addEventListener("click", () => {
    const url = "https://taskbarherowiki.com/items";
    const backend = getBackend();
    if (backend) {
        backend.OpenUrl(url);
    } else {
        window.open(url, "_blank");
    }
});

// Ação de abrir o Discord
document.getElementById("btnDiscord").addEventListener("click", (e) => {
    e.preventDefault();
    const url = "https://discord.gg/jxDBTRabZ8";
    const backend = getBackend();
    if (backend) {
        backend.OpenUrl(url);
    } else {
        window.open(url, "_blank");
    }
});

// Ação de Gerar Item (Spawn)
document.getElementById("btnSpawnItem").addEventListener("click", () => {
    const itemId = parseInt(document.getElementById("txtItemId").value);
    const type = parseInt(document.getElementById("selCategory").value);

    if (!itemId || itemId <= 0) {
        showToast("⚠️ Digite um ID de item válido!");
        return;
    }

    showToast(`⚡ SPAWNANDO ITEM ID: ${itemId}`);

    const backend = getBackend();
    if (backend) {
        backend.SpawnItem(itemId, 1, type);
    } else {
        console.log(`[Mock Spawn] ID: ${itemId}, Count: 1, Type: ${type}`);
    }
});

// Notificações Toast
function showToast(message) {
    const toast = document.getElementById("toastNotification");
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 2800);
}

// Navegação das Abas
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
        
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        document.getElementById(`panel-${tabId}`).classList.add("active");
    });
});

document.getElementById("closeBtn").addEventListener("click", () => {
    const backend = getBackend();
    if (backend) {
        backend.CloseApplication();
    } else {
        window.close();
    }
});

document.getElementById("minimizeBtn").addEventListener("click", () => {
    const backend = getBackend();
    if (backend) {
        backend.MinimizeApplication();
    } else {
        console.log("Mock Minimize App");
    }
});

// Drag Window
let isDragging = false;
let startX, startY;
document.getElementById("dragHeader").addEventListener("mousedown", (e) => {
    if (e.target.className === "close-btn") return;
    isDragging = true;
    startX = e.screenX;
    startY = e.screenY;
});

window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.screenX - startX;
    const dy = e.screenY - startY;
    startX = e.screenX;
    startY = e.screenY;
    const backend = getBackend();
    if (backend) {
        backend.DragWindow(dx, dy);
    }
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

// Eventos de Hack / Cheats
document.getElementById("chkDlc").addEventListener("change", (e) => {
    const backend = getBackend();
    if (backend) backend.ToggleDlc(e.target.checked);
    showToast(`DLC Unlocker: ${e.target.checked ? 'ATIVADO' : 'DESATIVADO'}`);
});

document.getElementById("chkPets").addEventListener("change", (e) => {
    const backend = getBackend();
    if (backend) backend.TogglePets(e.target.checked);
    showToast(`Pets Unlocker: ${e.target.checked ? 'ATIVADO' : 'DESATIVADO'}`);
});

document.getElementById("chkGold").addEventListener("change", (e) => {
    const backend = getBackend();
    if (backend) backend.ToggleGold(e.target.checked);
    showToast(`Ouro Hack: ${e.target.checked ? 'ATIVADO' : 'DESATIVADO'}`);
});

document.getElementById("chkExp").addEventListener("change", (e) => {
    const backend = getBackend();
    if (backend) backend.ToggleExp(e.target.checked);
    showToast(`Exp Hack: ${e.target.checked ? 'ATIVADO' : 'DESATIVADO'}`);
});

document.getElementById("chkBoss").addEventListener("change", (e) => {
    const backend = getBackend();
    if (backend) backend.ToggleBoss(e.target.checked);
    showToast(`Apenas Bosses: ${e.target.checked ? 'ATIVADO' : 'DESATIVADO'}`);
});

document.getElementById("chkGod").addEventListener("change", (e) => {
    const backend = getBackend();
    if (backend) backend.ToggleGod(e.target.checked);
    showToast(`God Mode: ${e.target.checked ? 'ATIVADO' : 'DESATIVADO'}`);
});

document.getElementById("chkOhk").addEventListener("change", (e) => {
    const backend = getBackend();
    if (backend) backend.ToggleOhk(e.target.checked);
    showToast(`One Hit Kill: ${e.target.checked ? 'ATIVADO' : 'DESATIVADO'}`);
});

document.getElementById("chkSpeed").addEventListener("change", (e) => {
    const backend = getBackend();
    const speedVal = e.target.checked ? "2.5" : "1.0";
    if (backend) backend.SetSpeed(speedVal);
    showToast(`Speedhack: ${e.target.checked ? 'ATIVADO (2.5x)' : 'DESATIVADO'}`);
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    const backend = getBackend();

    // Lógica do Painel de Ativação / Licenciamento
    if (backend) {
        try {
            // Exibe a versão real compilada no rodapé
            const appVersion = backend.GetAppVersion();
            const versionLabel = document.getElementById("lblFooterVersion");
            if (versionLabel) versionLabel.textContent = `v${appVersion}`;

            // Exibe o HWID atual na tela de ativação
            const hwid = backend.GetHwid();
            document.getElementById("lblHwid").textContent = hwid;

            // Executa verificação inicial de licença ativa (sem bloquear a UI)
            setTimeout(() => {
                const isValid = backend.IsLicenseValid();
                if (isValid) {
                    document.getElementById("activationContainer").style.display = "none";
                    document.getElementById("trainerContent").style.display = "flex";
                    showToast("🔓 Licença ativa!");
                    updateLicenseHeader();
                } else {
                    document.getElementById("activationContainer").style.display = "flex";
                    document.getElementById("trainerContent").style.display = "none";
                }
            }, 100);
        } catch (err) {
            console.error("Erro ao verificar licença:", err);
        }
    } else {
        // Modo Mock/Desenvolvedor Web
        const versionLabel = document.getElementById("lblFooterVersion");
        if (versionLabel) versionLabel.textContent = "v1.0.3 (Mock)";

        document.getElementById("lblHwid").textContent = "MOCK-HWID-1234-5678-ABCD";
        // No navegador normal, simula tela de ativação disponível
        document.getElementById("activationContainer").style.display = "flex";
        document.getElementById("trainerContent").style.display = "none";
    }

    // Evento do Botão de Ativar
    document.getElementById("btnActivate").addEventListener("click", () => {
        const keyInput = document.getElementById("txtActivationKey");
        const btn = document.getElementById("btnActivate");
        const key = keyInput.value.trim();

        if (!key) {
            showToast("⚠️ Insira uma chave de ativação!");
            return;
        }

        // Validação básica de formato xxxxx-xxxxx-xxxxx-xxxxx-xxxxx
        const keyPattern = /^[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}$/;
        if (!keyPattern.test(key)) {
            showToast("⚠️ Formato de chave inválido! Use XXXXX-XXXXX-XXXXX-XXXXX-XXXXX");
            return;
        }

        btn.disabled = true;
        btn.textContent = "VERIFICANDO...";
        keyInput.disabled = true;

        setTimeout(() => {
            const currentBackend = getBackend();
            if (currentBackend) {
                try {
                    const resultJson = currentBackend.ActivateLicense(key);
                    const result = JSON.parse(resultJson);

                    if (result.success) {
                        showToast(`✔️ ${result.message}`);
                        document.getElementById("activationContainer").style.display = "none";
                        document.getElementById("trainerContent").style.display = "flex";
                        updateLicenseHeader();
                    } else {
                        showToast(`❌ ${result.message}`);
                        btn.disabled = false;
                        btn.textContent = "🔑 ATIVAR AGORA";
                        keyInput.disabled = false;
                    }
                } catch (err) {
                    showToast("❌ Erro ao comunicar com o backend.");
                    btn.disabled = false;
                    btn.textContent = "🔑 ATIVAR AGORA";
                    keyInput.disabled = false;
                }
            } else {
                // Mock Simulação de Sucesso se digitar chaves de mock
                if (key === "AAAAA-BBBBB-CCCCC-DDDDD-EEEEE") {
                    showToast("✔️ [Mock] Licença ativada com sucesso!");
                    document.getElementById("activationContainer").style.display = "none";
                    document.getElementById("trainerContent").style.display = "flex";
                    updateLicenseHeader();
                } else {
                    showToast("❌ [Mock] Chave inválida.");
                    btn.disabled = false;
                    btn.textContent = "🔑 ATIVAR AGORA";
                    keyInput.disabled = false;
                }
            }
        }, 500);
    });

    document.getElementById("btnSpeedLog").addEventListener("click", () => {
        const area = document.getElementById("txtSpeedLog");
        const currentBackend = getBackend();
        if (currentBackend) {
            area.value = currentBackend.GetSpeedhackLog();
        } else {
            area.value = "Backend indisponível (Mock)";
        }
        area.style.display = area.style.display === "none" ? "block" : "none";
    });

    // --- LÓGICA DO AUTO-UPDATER ---
    let downloadUrl = "";

    document.getElementById("btnCheckUpdate").addEventListener("click", () => {
        const btn = document.getElementById("btnCheckUpdate");
        const lblStatus = document.getElementById("lblUpdateStatus");
        const infoContainer = document.getElementById("updateInfoContainer");
        const txtChangelog = document.getElementById("txtChangelog");

        btn.disabled = true;
        btn.textContent = "VERIFICANDO...";
        lblStatus.textContent = "Consultando GitHub...";

        setTimeout(() => {
            const currentBackend = getBackend();
            if (currentBackend) {
                try {
                    const resultJson = currentBackend.CheckForUpdates();
                    const result = JSON.parse(resultJson);

                    if (result.error) {
                        lblStatus.textContent = "Erro ao buscar atualizações.";
                        showToast(`❌ Erro: ${result.error}`);
                        btn.disabled = false;
                        btn.textContent = "🔍 VERIFICAR ATUALIZAÇÕES";
                        return;
                    }

                    if (result.isAvailable) {
                        lblStatus.textContent = `Nova versão: ${result.newVersion}`;
                        lblStatus.style.color = "#4caf50";
                        txtChangelog.value = result.changelog || "Sem changelog.";
                        downloadUrl = result.downloadUrl;
                        infoContainer.style.display = "flex";
                        showToast(`✨ Nova versão ${result.newVersion} disponível!`);
                    } else {
                        lblStatus.textContent = "Trainer atualizado!";
                        lblStatus.style.color = "#ffdca3";
                        infoContainer.style.display = "none";
                        showToast("✔️ Trainer já está na última versão!");
                    }
                } catch (err) {
                    lblStatus.textContent = "Erro ao checar atualizações.";
                    showToast("❌ Erro ao comunicar com atualizador.");
                }
            } else {
                // Mock / Navegador
                lblStatus.textContent = "Nova versão: v1.0.3 (Mock)";
                lblStatus.style.color = "#4caf50";
                txtChangelog.value = "* Melhorias de estabilidade no One Hit Kill.\n* Adicionado painel de Atualização Automática.\n* Correção de bugs de sincronização.";
                downloadUrl = "https://github.com/deflatsecurity/xingmaster-tbh/releases/download/v1.0.3/TRAINER_RELEASE.zip";
                infoContainer.style.display = "flex";
                showToast("✨ [Mock] Nova versão v1.0.3 encontrada!");
            }
            btn.disabled = false;
            btn.textContent = "🔍 VERIFICAR ATUALIZAÇÕES";
        }, 800);
    });

    document.getElementById("btnStartUpdate").addEventListener("click", () => {
        const btn = document.getElementById("btnStartUpdate");
        const btnCheck = document.getElementById("btnCheckUpdate");
        const progressContainer = document.getElementById("progressContainer");

        if (!downloadUrl) {
            showToast("⚠️ Nenhuma URL de download encontrada!");
            return;
        }

        btn.disabled = true;
        btn.textContent = "INICIANDO...";
        btnCheck.disabled = true;
        progressContainer.style.display = "flex";

        console.log("[JS]: Iniciando download. URL =", downloadUrl);

        const currentBackend = getBackend();
        if (currentBackend) {
            try {
                console.log("[JS]: Chamando backend C# StartUpdate...");
                currentBackend.StartUpdate(downloadUrl);
                console.log("[JS]: Chamou C# StartUpdate com sucesso!");
            } catch (err) {
                console.error("[JS]: Erro ao chamar C# StartUpdate:", err);
                showToast("❌ Falha ao iniciar download.");
                btn.disabled = false;
                btn.textContent = "⚡ BAIXAR E INSTALAR ⚡";
                btnCheck.disabled = false;
            }
        } else {
            console.log("[JS]: Backend C# nao encontrado, iniciando Mock...");
            // Mock de Progresso no Navegador
            let pct = 0;
            const interval = setInterval(() => {
                pct += 10;
                window.updateProgress(pct);
                if (pct >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        window.updateCompleted(true);
                    }, 500);
                }
            }, 200);
        }
    });

    // Callbacks globais chamados pelo C#
    window.updateProgress = function(percent) {
        const fill = document.getElementById("progressBarFill");
        const lbl = document.getElementById("lblProgressPercent");
        if (fill && lbl) {
            fill.style.width = `${percent}%`;
            lbl.textContent = `${percent}%`;
        }
    };

    window.updateCompleted = function(success, errorMessage) {
        const btn = document.getElementById("btnStartUpdate");
        const btnCheck = document.getElementById("btnCheckUpdate");
        const fill = document.getElementById("progressBarFill");
        const lbl = document.getElementById("lblProgressPercent");

        if (success) {
            showToast("✔️ Atualização concluída! Reiniciando...");
            if (fill && lbl) {
                fill.style.backgroundColor = "#4caf50";
                lbl.textContent = "100%";
            }
        } else {
            showToast(`❌ Falha na atualização: ${errorMessage || "Erro desconhecido"}`);
            if (btn && btnCheck) {
                btn.disabled = false;
                btn.textContent = "⚡ BAIXAR E INSTALAR ⚡";
                btnCheck.disabled = false;
            }
        }
    };

    // Verifica status da conexão a cada 2 segundos se o trainer estiver ativo
    setInterval(() => {
        const currentBackend = getBackend();
        if (currentBackend) {
            const trainerContentVisible = document.getElementById("trainerContent").style.display === "flex";
            if (!trainerContentVisible) return;

            const connected = currentBackend.CheckGameConnection();
            const statusLabel = document.getElementById("gameStatus");
            const footerLabel = document.getElementById("footerConnectionState");
            if (connected) {
                statusLabel.textContent = "CONECTADO";
                statusLabel.className = "status-connected";
                footerLabel.textContent = "Online";
                footerLabel.style.color = "#4caf50";
            } else {
                statusLabel.textContent = "DESCONECTADO";
                statusLabel.className = "status-disconnected";
                footerLabel.textContent = "Offline";
                footerLabel.style.color = "#f44336";
            }
        }
    }, 2000);

    function updateLicenseHeader() {
        const currentBackend = getBackend();
        if (currentBackend) {
            try {
                const statusJson = currentBackend.GetLicenseStatusJson();
                const status = JSON.parse(statusJson);
                const lbl = document.getElementById("lblLicenseDays");
                if (lbl) {
                    const type = status.Type || status.type;
                    const message = status.Message || status.message;
                    const daysRemaining = status.DaysRemaining !== undefined ? status.DaysRemaining : status.daysRemaining;

                    if (type === "lifetime") {
                        lbl.textContent = "LICENÇA VITALÍCIA";
                        lbl.style.color = "#ffdca3"; // Dourado
                    } else if (type === "timed") {
                        lbl.textContent = `LICENÇA: ${message.toUpperCase()}`;
                        if (daysRemaining <= 2) {
                            lbl.style.color = "#f44336"; // Vermelho crítico
                        } else {
                            lbl.style.color = "#4caf50"; // Verde
                        }
                    } else {
                        lbl.textContent = "";
                    }
                }
            } catch (err) {
                console.error("Erro ao ler status da licenca:", err);
            }
        } else {
            const lbl = document.getElementById("lblLicenseDays");
            if (lbl) {
                lbl.textContent = "LICENÇA MOCK: 30 DIAS RESTANTES";
                lbl.style.color = "#4caf50";
            }
        }
    }
});
