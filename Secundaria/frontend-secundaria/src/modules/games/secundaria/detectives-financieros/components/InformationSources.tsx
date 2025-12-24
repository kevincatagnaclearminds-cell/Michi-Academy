import React, { useState } from 'react';
import { InformationSource, Company } from '../types';
import { companies } from '../data';
import './InformationSources.css';

interface InformationSourcesProps {
    sources: InformationSource[];
    selectedSources: string[];
    onToggleSource: (sourceId: string) => void;
    company: Company;
}

// Datos de CEOs y empresas
const ceoNames = [
    'Carlos Mendoza', 'María González', 'Roberto Silva', 
    'Ana Martínez', 'Luis Ramírez', 'Patricia López', 
    'Fernando Torres', 'Laura Sánchez'
];

const companyNames = companies.map(c => c.name);

// Función para determinar el tipo de superintendencia según el sector
const getSuperintendenceType = (sector: string): string => {
    if (sector === 'Finanzas' || sector === 'Bancos') {
        return 'SUPERINTENDENCIA DE BANCOS';
    } else if (sector === 'Gobierno') {
        return 'MINISTERIO DE HACIENDA';
    } else {
        return 'SUPERINTENDENCIA DE COMPAÑÍAS, VALORES Y SEGUROS';
    }
};

// URLs disponibles
const getAvailableUrls = (): string[] => {
    return [
        'www.superintendencias.com',
        'sri.com.ec',
        'funcionjudicial.gob.ec',
        'google.com/reviews',
        'x.com'
    ];
};

// Generar datos según la fuente
const generateFinancialData = (sourceType: string, company: Company) => {
    if (sourceType === 'superintendencia') {
        const assets = Math.floor(Math.random() * 500000) + 100000;
        const liabilities = company.riskLevel === 'Alto' ? Math.floor(assets * 0.9) : Math.floor(assets * 0.4);
        const equity = assets - liabilities;
        const profit = company.riskLevel === 'Alto' ? -Math.floor(Math.random() * 50000) : Math.floor(Math.random() * 100000);
        
        return {
            type: 'superintendencia',
            assets,
            liabilities,
            equity,
            profit,
            isGood: company.riskLevel !== 'Alto' && profit > 0
        };
    } else if (sourceType === 'sri') {
        const hasDebt = company.riskLevel === 'Alto';
        return {
            type: 'sri',
            taxStatus: hasDebt ? 'DEBE IMPUESTOS' : 'AL DÍA',
            lastPayment: hasDebt ? 'Pendiente desde hace ' + (Math.floor(Math.random() * 12) + 1) + ' meses' : 'Último pago: Hace ' + (Math.floor(Math.random() * 3) + 1) + ' mes(es)',
            taxDebt: hasDebt ? Math.floor(Math.random() * 50000) + 10000 : 0,
            declarations: hasDebt ? 'Declaraciones pendientes' : 'Todas las declaraciones al día',
            compliance: hasDebt ? 'NO CUMPLE' : 'CUMPLE'
        };
    } else if (sourceType === 'banco') {
        return {
            type: 'banco',
            registrationStatus: company.riskLevel === 'Alto' ? 'NO REGISTRADA' : 'REGISTRADA',
            licenseStatus: company.riskLevel === 'Alto' ? 'SIN LICENCIA' : 'CON LICENCIA VIGENTE',
            lastInspection: company.riskLevel === 'Alto' ? 'Sin inspecciones recientes' : 'Última inspección: Hace ' + (Math.floor(Math.random() * 6) + 1) + ' meses'
        };
    } else if (sourceType === 'judicial') {
        const hasLegalIssues = company.riskLevel === 'Alto';
        return {
            type: 'judicial',
            hasIssues: hasLegalIssues,
            cases: hasLegalIssues ? Math.floor(Math.random() * 5) + 1 : 0,
            status: hasLegalIssues ? 'CASOS PENDIENTES' : 'SIN CASOS',
            description: hasLegalIssues ? 'La empresa tiene casos legales pendientes' : 'No se registran casos legales contra la empresa'
        };
    } else if (sourceType === 'google') {
        const reviews = company.riskLevel === 'Alto' ? [
            { author: 'Juan Pérez', rating: 1, text: 'No cumplieron con lo prometido. Perdí mi dinero.', date: 'Hace 2 meses' },
            { author: 'María López', rating: 2, text: 'Muy mala experiencia. No recomiendo.', date: 'Hace 1 mes' },
            { author: 'Carlos Ruiz', rating: 1, text: 'Estafa total. No inviertan aquí.', date: 'Hace 3 semanas' }
        ] : company.riskLevel === 'Medio' ? [
            { author: 'Roberto Silva', rating: 4, text: 'Buena empresa, cumplieron con lo acordado.', date: 'Hace 1 mes' },
            { author: 'Laura Martínez', rating: 3, text: 'Regular, algunos retrasos pero al final cumplieron.', date: 'Hace 2 meses' }
        ] : [
            { author: 'Sofía Ramírez', rating: 5, text: 'Excelente servicio, muy confiable y profesional.', date: 'Hace 1 mes' },
            { author: 'Miguel Torres', rating: 5, text: 'La mejor inversión que he hecho. Totalmente recomendado.', date: 'Hace 2 meses' }
        ];
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        return { type: 'google', reviews, averageRating: averageRating.toFixed(1) };
    }
    return null;
};

// Generar posts de CEO
const generateCEOPosts = (company: Company, ceoName: string) => {
    return [
        {
            text: `¡Increíble oportunidad de inversión! Retornos garantizados del ${company.interestRate}% anual. No dejes pasar esta oportunidad única. 💰🚀`,
            likes: Math.floor(Math.random() * 30) + 5,
            dislikes: Math.floor(Math.random() * 150) + 100,
            angryReactions: Math.floor(Math.random() * 80) + 60,
            date: 'Hace 2 días'
        },
        {
            text: 'Nuestro nuevo proyecto revolucionario está cambiando el mercado. Únete a nosotros y sé parte del éxito. 🚀💎',
            likes: Math.floor(Math.random() * 25) + 3,
            dislikes: Math.floor(Math.random() * 120) + 90,
            angryReactions: Math.floor(Math.random() * 70) + 50,
            date: 'Hace 5 días'
        },
        {
            text: 'La mejor inversión que puedes hacer este año. Confía en nosotros, tenemos años de experiencia. 💼✨',
            likes: Math.floor(Math.random() * 20) + 2,
            dislikes: Math.floor(Math.random() * 100) + 80,
            angryReactions: Math.floor(Math.random() * 60) + 40,
            date: 'Hace 1 semana'
        }
    ];
};

// Generar posts de superintendencia etiquetados a empresas
const generateSuperintendencePosts = () => {
    return companies.map(comp => {
        const pointChange = comp.riskLevel === 'Alto' ? 
            -(Math.floor(Math.random() * 5) + 2) : 
            (Math.floor(Math.random() * 4) + 1);
        return {
            companyName: comp.name,
            text: `Actualización de calificación: ${comp.name} ${pointChange > 0 ? 'subió' : 'bajó'} ${Math.abs(pointChange)} punto${Math.abs(pointChange) > 1 ? 's' : ''} en nuestra evaluación de riesgo.`,
            date: `Hace ${Math.floor(Math.random() * 30) + 1} días`,
            verified: true
        };
    });
};

const InformationSources: React.FC<InformationSourcesProps> = ({ 
    sources, 
    selectedSources, 
    onToggleSource,
    company
}) => {
    const [selectedUrl, setSelectedUrl] = useState<string>('');
    const [searchedRuc, setSearchedRuc] = useState<string>('');
    const [searchedUsername, setSearchedUsername] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any>(null);
    const [twitterProfile, setTwitterProfile] = useState<string | null>(null);
    
    const availableUrls = getAvailableUrls();
    
    const handleUrlSelect = (url: string) => {
        setSelectedUrl(url);
        setSearchedRuc('');
        setSearchedUsername('');
        setSearchResults(null);
        setTwitterProfile(null);
    };
    
    const handleSearch = () => {
        if (!selectedUrl) return;
        
        if (selectedUrl.includes('x.com') || selectedUrl.includes('twitter')) {
            // Búsqueda de usuario en X/Twitter
            if (!searchedUsername.trim()) return;
            setTwitterProfile(searchedUsername);
            return;
        }
        
        if (!searchedRuc.trim()) {
            alert('Por favor ingrese un RUC para buscar');
            return;
        }
        
        let sourceType = '';
        if (selectedUrl.includes('superintendencias')) {
            sourceType = 'superintendencia';
        } else if (selectedUrl.includes('sri')) {
            sourceType = 'sri';
        } else if (selectedUrl.includes('funcionjudicial')) {
            sourceType = 'judicial';
        } else if (selectedUrl.includes('google')) {
            sourceType = 'google';
        }
        
        if (!sourceType) {
            console.error('Tipo de fuente no reconocido para URL:', selectedUrl);
            return;
        }
        
        const results = generateFinancialData(sourceType, company);
        if (!results) {
            console.error('No se generaron resultados para el tipo:', sourceType);
            return;
        }
        
        setSearchResults(results);
        
        // Seleccionar fuente correspondiente
        const matchingSource = sources.find(s => {
            if (sourceType === 'superintendencia') {
                return s.name.includes('Superintendencia') && !s.name.includes('Redes');
            } else if (sourceType === 'sri') {
                return s.name.includes('SRI') || s.name.includes('Servicio de Rentas');
            } else if (sourceType === 'judicial') {
                return s.name.includes('Función Judicial');
            } else if (sourceType === 'google') {
                return s.name.includes('Google') || s.name.includes('Reviews');
            }
            return false;
        });
        
        if (matchingSource && !selectedSources.includes(matchingSource.id)) {
            onToggleSource(matchingSource.id);
        }
    };
    
    // Obtener CEO actual
    const getCurrentCEO = () => {
        const index = parseInt(company.id) - 1;
        return ceoNames[index % ceoNames.length];
    };
    
    // Obtener username de Twitter de la card (nombre de empresa en minúsculas sin espacios)
    const getCompanyTwitterUsername = () => {
        return `@${company.name.toLowerCase().replace(/\s+/g, '')}`;
    };
    
    // Generar comentarios/replies con bots y usuarios reales
    const generatePostReplies = (post: any) => {
        const botComments = [
            { username: 'BotInvest2024', text: '¡Excelente oportunidad! Ya invertí y estoy muy contento 🚀', isBot: true },
            { username: 'AutoTrader_Bot', text: 'Retornos garantizados, la mejor inversión del año 💰', isBot: true },
            { username: 'FinanceBot_AI', text: 'Análisis confirmado: inversión segura y rentable ✅', isBot: true },
            { username: 'InvestBot_Pro', text: 'Recomendado por expertos, no te lo pierdas! 📈', isBot: true },
            { username: 'TradingBot_X', text: 'Oportunidad única, retornos excepcionales! 🎯', isBot: true }
        ];
        
        const realUserComments = [
            { username: 'JuanPerez_EC', text: 'Tengo dudas sobre esta inversión, alguien más ha invertido?', isBot: false },
            { username: 'MariaGarcia', text: 'Parece demasiado bueno para ser verdad...', isBot: false },
            { username: 'CarlosInvest', text: 'Investigué y encontré información preocupante', isBot: false },
            { username: 'AnaFinanzas', text: 'No recomiendo, tuve una mala experiencia', isBot: false },
            { username: 'LuisEconomia', text: 'Mejor consultar con un asesor financiero primero', isBot: false }
        ];
        
        // Mezclar comentarios de bots y usuarios reales
        const allComments = [...botComments.slice(0, 3), ...realUserComments.slice(0, 2)];
        return allComments.sort(() => Math.random() - 0.5);
    };
    
    const renderWebsiteInterface = () => {
        if (!selectedUrl) {
    return (
                <div className="browser-placeholder">
                    <div className="placeholder-icon">🌐</div>
                    <div className="placeholder-text">Selecciona una URL para comenzar la investigación</div>
                </div>
            );
        }
        
        // X/Twitter Interface
        if (selectedUrl.includes('x.com') || selectedUrl.includes('twitter')) {
            if (!twitterProfile) {
    return (
                    <div className="website-interface twitter-interface">
                        <div className="twitter-header">
                            <div className="twitter-logo">𝕏</div>
                            <div className="twitter-nav">
                                <span className="nav-item active">Inicio</span>
                                <span className="nav-item">Explorar</span>
                                <span className="nav-item">Notificaciones</span>
                            </div>
                            <div className="twitter-user">@UsuarioInvestigador</div>
                        </div>
                        <div className="twitter-content">
                            <div className="twitter-search-section">
                                <h3 className="search-title">Buscar usuario</h3>
                                <div className="search-box">
                                    <input
                                        type="text"
                                        className="username-input"
                                        placeholder={`Ejemplo: ${getCompanyTwitterUsername()}`}
                                        value={searchedUsername}
                                        onChange={(e) => setSearchedUsername(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <button className="search-button" onClick={handleSearch}>
                                        🔍 Buscar
                                    </button>
                                </div>
                                <div className="search-hint">
                                    💡 Copie el nombre de usuario de la tarjeta de información de la empresa
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                // Mostrar perfil de X/Twitter
                const isSuperintendence = twitterProfile === '@SuperintendenciaEC';
                const isCompanyProfile = twitterProfile === getCompanyTwitterUsername();
                const currentCompanyForProfile = isCompanyProfile ? company : null;
                    
                    return (
                    <div className="website-interface twitter-interface">
                        <div className="twitter-header">
                            <div className="twitter-logo">𝕏</div>
                            <div className="twitter-nav">
                                <span className="nav-item" onClick={() => setTwitterProfile(null)}>← Volver</span>
                            </div>
                            <div className="twitter-user">@UsuarioInvestigador</div>
                                </div>
                        <div className="twitter-content">
                            <div className="twitter-profile">
                                <div className="profile-header">
                                    <div className="profile-avatar">{isSuperintendence ? '🏛️' : '🏢'}</div>
                                    <div className="profile-info">
                                        <div className="profile-name">{isSuperintendence ? 'Superintendencia Oficial' : company.name}</div>
                                        <div className="profile-username">{twitterProfile}</div>
                                        {isSuperintendence && (
                                            <div className="verified-badge">✓ Verificado</div>
                                        )}
                                    </div>
                                </div>
                                <div className="profile-posts">
                                    {isSuperintendence ? (
                                        <div className="posts-list">
                                            {generateSuperintendencePosts().map((post, idx) => (
                                                <div key={idx} className="twitter-post verified-post">
                                                    <div className="post-header">
                                                        <span className="post-author">🏛️ Superintendencia Oficial</span>
                                                        <span className="post-date">{post.date}</span>
                                                    </div>
                                                    <div className="post-content">{post.text}</div>
                                                    <div className="post-tags">Etiquetado: {post.companyName}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : currentCompanyForProfile && (
                                        <div className="posts-list">
                                            {generateCEOPosts(currentCompanyForProfile, getCurrentCEO()).map((post, idx) => {
                                                const replies = generatePostReplies(post);
                                                return (
                                                    <div key={idx} className="twitter-post">
                                                        <div className="post-header">
                                                            <span className="post-author">{company.name}</span>
                                                            <span className="post-date">{post.date}</span>
                                                        </div>
                                                        <div className="post-content">{post.text}</div>
                                                        <div className="post-reactions">
                                                            <div className="reaction-item">
                                                                <span className="reaction-icon">👍</span>
                                                                <span className="reaction-count">{post.likes}</span>
                                                            </div>
                                                            <div className="reaction-item">
                                                                <span className="reaction-icon">👎</span>
                                                                <span className="reaction-count">{post.dislikes}</span>
                                                            </div>
                                                            <div className="reaction-item">
                                                                <span className="reaction-icon">😠</span>
                                                                <span className="reaction-count">{post.angryReactions}</span>
                                                            </div>
                                                        </div>
                                                        <div className="post-replies">
                                                            {replies.map((reply, replyIdx) => {
                                                                const initial = reply.username.charAt(0).toUpperCase();
                                                                return (
                                                                    <div key={replyIdx} className="reply-item">
                                                                        <div className="reply-header">
                                                                            <div className={`reply-avatar ${reply.isBot ? 'bot-avatar' : 'user-avatar'}`}>
                                                                                {reply.isBot ? '🤖' : initial}
                                                                            </div>
                                                                            <span className="reply-username">{reply.username}</span>
                                                                        </div>
                                                                        <div className="reply-content">{reply.text}</div>
                        </div>
                    );
                })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }
        
        // Otras interfaces
        if (!searchResults) {
            // Interfaz de búsqueda
            if (selectedUrl.includes('superintendencias')) {
                return (
                    <div className="website-interface">
                        <div className="website-header">
                            <div className="website-logo">🏛️</div>
                            <div className="website-title">{getSuperintendenceType(company.sector)}</div>
                        </div>
                        <div className="website-content">
                            <div className="search-section">
                                <h3 className="search-title">¿Qué empresa quiere consultar?</h3>
                                <div className="search-box">
                                    <input
                                        type="text"
                                        className="ruc-input"
                                        placeholder="Ingrese el RUC de la empresa"
                                        value={searchedRuc}
                                        onChange={(e) => setSearchedRuc(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <button className="search-button" onClick={handleSearch}>
                                        🔍 Buscar
                                    </button>
                                </div>
                                <div className="search-hint">
                                    💡 Copie el RUC de la tarjeta de información de la empresa
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (selectedUrl.includes('sri')) {
                return (
                    <div className="website-interface">
                        <div className="website-header">
                            <div className="website-logo">📋</div>
                            <div className="website-title">SERVICIO DE RENTAS INTERNAS (SRI)</div>
                        </div>
                        <div className="website-content">
                            <div className="search-section">
                                <h3 className="search-title">Consulta de Estado Fiscal</h3>
                                <div className="search-box">
                                    <input
                                        type="text"
                                        className="ruc-input"
                                        placeholder="Ingrese el RUC de la empresa"
                                        value={searchedRuc}
                                        onChange={(e) => setSearchedRuc(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <button className="search-button" onClick={handleSearch}>
                                        🔍 Buscar
                                    </button>
                                </div>
                                <div className="search-hint">
                                    💡 Copie el RUC de la tarjeta de información de la empresa
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (selectedUrl.includes('funcionjudicial')) {
                return (
                    <div className="website-interface">
                        <div className="website-header">
                            <div className="website-logo">⚖️</div>
                            <div className="website-title">FUNCIÓN JUDICIAL</div>
                        </div>
                        <div className="website-content">
                            <div className="search-section">
                                <h3 className="search-title">Consulta de Casos Judiciales</h3>
                                <div className="search-box">
                                    <input
                                        type="text"
                                        className="ruc-input"
                                        placeholder="Ingrese el RUC del CEO"
                                        value={searchedRuc}
                                        onChange={(e) => setSearchedRuc(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <button className="search-button" onClick={handleSearch}>
                                        🔍 Buscar
                                    </button>
                                </div>
                                <div className="search-hint">
                                    💡 Copie el RUC del CEO de la tarjeta de información de la empresa
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (selectedUrl.includes('google')) {
                return (
                    <div className="website-interface">
                        <div className="website-header">
                            <div className="website-logo">⭐</div>
                            <div className="website-title">Google Reviews</div>
                        </div>
                        <div className="website-content">
                            <div className="search-section">
                                <h3 className="search-title">Buscar reseñas de empresa</h3>
                                <div className="search-box">
                                    <input
                                        type="text"
                                        className="ruc-input"
                                        placeholder="Ingrese el nombre de la empresa"
                                        value={searchedRuc}
                                        onChange={(e) => setSearchedRuc(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <button className="search-button" onClick={handleSearch}>
                                        🔍 Buscar
                                    </button>
                                </div>
                                <div className="search-hint">
                                    💡 Escriba el nombre de la empresa para ver sus reseñas
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        } else {
            // Mostrar resultados
            if (searchResults.type === 'superintendencia') {
                return (
                    <div className="website-interface">
                        <div className="website-header">
                            <div className="website-logo">🏛️</div>
                            <div className="website-title">{getSuperintendenceType(company.sector)}</div>
                        </div>
                        <div className="website-content">
                            <div className="search-info">
                                <div className="search-result-header">
                                    <span className="result-label">RUC consultado:</span>
                                    <span className="result-ruc">{searchedRuc}</span>
                                </div>
                            </div>
                            <div className="financial-results">
                                <div className="financial-metrics">
                                    <div className="metric">
                                        <span className="metric-label">Activos:</span>
                                        <span className="metric-value positive">+${searchResults.assets.toLocaleString()}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Pasivos:</span>
                                        <span className="metric-value negative">-${searchResults.liabilities.toLocaleString()}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Patrimonio:</span>
                                        <span className={`metric-value ${searchResults.isGood ? 'positive' : 'negative'}`}>
                                            ${searchResults.equity.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Utilidad:</span>
                                        <span className={`metric-value ${searchResults.profit > 0 ? 'positive' : 'negative'}`}>
                                            {searchResults.profit > 0 ? '+' : ''}${searchResults.profit.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="rating-info">
                                    <div className="rating-note">
                                        ⚠️ La calificación de riesgo debe ser evaluada por el usuario basándose en estos datos financieros.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (searchResults.type === 'sri') {
                return (
                    <div className="website-interface">
                        <div className="website-header">
                            <div className="website-logo">📋</div>
                            <div className="website-title">SERVICIO DE RENTAS INTERNAS (SRI)</div>
                        </div>
                        <div className="website-content">
                            <div className="search-info">
                                <div className="search-result-header">
                                    <span className="result-label">RUC consultado:</span>
                                    <span className="result-ruc">{searchedRuc}</span>
                                </div>
                            </div>
                            <div className="sri-results">
                                <div className={`sri-status ${searchResults.taxStatus.includes('DEBE') ? 'negative' : 'positive'}`}>
                                    <span className="status-label">Estado Fiscal:</span>
                                    <span className="status-value">{searchResults.taxStatus}</span>
                                </div>
                                <div className="sri-details">
                                    <div className="sri-detail-item">
                                        <span className="detail-label">Declaraciones:</span>
                                        <span className={`detail-value ${searchResults.taxStatus.includes('DEBE') ? 'negative' : 'positive'}`}>
                                            {searchResults.declarations}
                                </span>
                                    </div>
                                    <div className="sri-detail-item">
                                        <span className="detail-label">Cumplimiento:</span>
                                        <span className={`detail-value ${searchResults.taxStatus.includes('DEBE') ? 'negative' : 'positive'}`}>
                                            {searchResults.compliance}
                                </span>
                            </div>
                                    <div className="sri-detail-item">
                                        <span className="detail-label">Último Pago:</span>
                                        <span className="detail-value">{searchResults.lastPayment}</span>
                                    </div>
                                    {searchResults.taxDebt > 0 && (
                                        <div className="sri-detail-item">
                                            <span className="detail-label">Deuda Fiscal:</span>
                                            <span className="detail-value negative">${searchResults.taxDebt.toLocaleString()}</span>
                                </div>
                            )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (searchResults.type === 'judicial') {
                return (
                    <div className="website-interface">
                        <div className="website-header">
                            <div className="website-logo">⚖️</div>
                            <div className="website-title">FUNCIÓN JUDICIAL</div>
                        </div>
                        <div className="website-content">
                            <div className="search-info">
                                <div className="search-result-header">
                                    <span className="result-label">RUC consultado:</span>
                                    <span className="result-ruc">{searchedRuc}</span>
                                </div>
                            </div>
                            <div className="judicial-results">
                                <div className={`judicial-status ${searchResults.hasIssues ? 'negative' : 'positive'}`}>
                                    <span className="status-label">Estado Legal:</span>
                                    <span className="status-value">{searchResults.status}</span>
                                </div>
                                <div className="judicial-details">
                                    <div className="judicial-detail-item">
                                        <span className="detail-label">Casos Pendientes:</span>
                                        <span className={`detail-value ${searchResults.hasIssues ? 'negative' : 'positive'}`}>
                                            {searchResults.cases}
                                        </span>
                                    </div>
                                    <div className="judicial-detail-item">
                                        <span className="detail-label">Descripción:</span>
                                        <span className="detail-value">{searchResults.description}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (searchResults.type === 'google') {
                return (
                    <div className="website-interface">
                        <div className="website-header">
                            <div className="website-logo">⭐</div>
                            <div className="website-title">Google Reviews - {company.name}</div>
                        </div>
                        <div className="website-content">
                            <div className="google-results">
                                <div className="average-rating">
                                    <div className="rating-number">{searchResults.averageRating}</div>
                                    <div className="rating-stars">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <span key={i} className={i < Math.round(parseFloat(searchResults.averageRating)) ? 'star-filled' : 'star-empty'}>
                                                ⭐
                                            </span>
                                        ))}
                                    </div>
                                    <div className="rating-count">{searchResults.reviews.length} reseñas</div>
                                </div>
                                <div className="reviews-list">
                                    {searchResults.reviews.map((review: any, idx: number) => (
                                        <div key={idx} className="review-item">
                                            <div className="review-header">
                                                <span className="review-author">{review.author}</span>
                                                <span className="review-rating">{'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                                <span className="review-date">{review.date}</span>
                                            </div>
                                            <div className="review-text">{review.text}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        </div>
                    );
            }
        }
        
        return null;
    };
    
    return (
        <div className="information-sources">
            <div className="browser-container">
                <div className="browser-bar">
                    <div className="browser-controls">
                        <span className="browser-dot red">●</span>
                        <span className="browser-dot yellow">●</span>
                        <span className="browser-dot green">●</span>
                    </div>
                    <div className="browser-url-bar">
                        <select
                            className="url-selector"
                            value={selectedUrl}
                            onChange={(e) => handleUrlSelect(e.target.value)}
                        >
                            <option value="">Selecciona una URL...</option>
                            {availableUrls.map((url, idx) => (
                                <option key={idx} value={url}>{url}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="browser-content">
                    {renderWebsiteInterface()}
                </div>
            </div>
        </div>
    );
};

export default InformationSources;
