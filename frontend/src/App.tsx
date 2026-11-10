
import { useEffect, useState, type FormEvent } from 'react';
import './App.css';

type AuthMode = 'login' | 'register';

type OperationType = 'deposit' | 'withdrawal' | 'transfer';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Account {
  id: string;
  accountNumber: string;
  balance: string | number;
  status: 'ACTIVE' | 'FROZEN';
  userId: string;
  createdAt: string;
}

type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  createdAt: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
}

interface TransactionHistory {
  accountId: string;
  transactions: Transaction[];
}

interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

interface LoginData {
  token: string;
  user: User;
}

const API_URL =  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Recuperar usuario almacenado
function getStoredUser(): User | null {
  const savedUser = localStorage.getItem('fintech_user');

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    localStorage.removeItem('fintech_user');
    return null;
  }
}

// Función para consultar la API
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || `Error en la solicitud: ${response.status}`
    );
  }

  return result as T;
}

function App() {
  // ESTADOS DE AUTENTICACIÓN
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState<User | null>(() =>
    localStorage.getItem('fintech_token') ? getStoredUser() : null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // ESTADOS DE CUENTAS
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);

  // ESTADOS DE OPERACIONES
  const [operationType, setOperationType] =
    useState<OperationType>('deposit');

  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [operationAmount, setOperationAmount] = useState('');

  const [operationMessage, setOperationMessage] = useState('');
  const [operationError, setOperationError] = useState('');
  const [operationLoading, setOperationLoading] = useState(false);

  // ESTADOS DE GESTIÓN DE CUENTAS

  const [accountActionLoading, setAccountActionLoading] =
    useState<string | null>(null);

  const [accountFeedback, setAccountFeedback] = useState('');
  const [accountActionError, setAccountActionError] = useState('');

  // ESTADOS DEL HISTORIAL
  const [selectedHistoryAccount, setSelectedHistoryAccount] =
    useState<string | null>(null);
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // CONSULTAR CUENTAS DEL USUARIO
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('fintech_token');

    if (!token) return;

    let cancelled = false;

    const loadAccounts = async () => {
      setLoadingAccounts(true);
      setAccountError('');

      try {
        const result = await apiRequest<ApiResponse<Account[]>>(
          '/accounts',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          setAccounts(result.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setAccountError(
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar las cuentas.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingAccounts(false);
        }
      }
    };

    void loadAccounts();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // REGISTRO E INICIO DE SESIÓN
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError('');
    setMessage('');

    const endpoint =
      mode === 'register' ? '/auth/register' : '/auth/login';

    const payload =
      mode === 'register'
        ? { name, email, password }
        : { email, password };

    try {
      if (mode === 'register') {
        await apiRequest<ApiResponse<User>>(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setMode('login');
        setName('');
        setPassword('');
      } else {
        const result = await apiRequest<ApiResponse<LoginData>>(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const { token, user } = result.data;

        if (!token || !user) {
          throw new Error('La respuesta de autenticación no es válida.');
        }

        localStorage.setItem('fintech_token', token);
        localStorage.setItem('fintech_user', JSON.stringify(user));

        setUser(user);
        setPassword('');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error inesperado.'
      );
    } finally {
      setLoading(false);
    }
  };

  // CREAR CUENTA BANCARIA
  const handleCreateAccount = async () => {
    const token = localStorage.getItem('fintech_token');

    if (!token) return;

    setCreatingAccount(true);
    setAccountError('');
    setOperationMessage('');

    try {
      await apiRequest<ApiResponse<Account>>('/accounts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await apiRequest<ApiResponse<Account[]>>('/accounts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAccounts(result.data || []);
    } catch (err) {
      setAccountError(
        err instanceof Error ? err.message : 'No se pudo crear la cuenta.'
      );
    } finally {
      setCreatingAccount(false);
    }
  };

  const handleRefreshBalance = async (accountId: string) => {
    const token = localStorage.getItem('fintech_token');
    if (!token) return;

    setAccountActionLoading(accountId);
    setAccountActionError('');
    setAccountFeedback('');

    try {
      const result = await apiRequest<ApiResponse<Account>>(
        `/accounts/${accountId}/balance`, { headers: {Authorization: `Bearer ${token}`,},}
      );

      setAccounts(currentAccounts => 
        currentAccounts.map(account => account.id === accountId ? { ...account, balance: result.data.balance } : account )
      );

      setAccountFeedback('Saldo actualizado correctamente.');
      } 
      
    catch (err) { setAccountActionError ( err instanceof Error ? err.message : 'No se pudo consultar el saldo.'); }
    finally { setAccountActionLoading(null); } 
  };

  const handleToggleAccountStatus = async (account: Account) => {
    const token = localStorage.getItem('fintech_token');
    if (!token) return;

    const action = account.status === 'FROZEN' ? 'unfreeze' : 'freeze';
    setAccountActionLoading(account.id);
    setAccountActionError('');
    setAccountFeedback('');

    try {const result = await apiRequest<{ 
      status: string; 
      message: string; 
    }> ( `/accounts/${account.id}/${action}`, {
      method: 'PATCH',
      headers: {Authorization: `Bearer ${token}`,},}
    );
    
    const accountsResult = await apiRequest<ApiResponse<Account[]>>( '/accounts', {
      headers: { Authorization: `Bearer ${token}`, }, }
    );

    setAccounts(accountsResult.data || []);
    setAccountFeedback(result.message);
    } 
    
    catch (err) { 
      setAccountActionError ( err instanceof Error ? err.message : 'No se pudo actualizar el estado de la cuenta.');}
      finally { setAccountActionLoading(null); }
  };

  const handleLoadHistory = async (accountId: string) => {
  const token = localStorage.getItem('fintech_token');

  if (!token) return;

  setSelectedHistoryAccount(accountId);
  setLoadingHistory(true);
  setHistoryError('');
  setTransactions([]);

  try {
    const result = await apiRequest<ApiResponse<TransactionHistory>>(
      `/transactions/history/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTransactions(result.data.transactions || []);
  } catch (err) {
    setHistoryError(
      err instanceof Error
        ? err.message
        : 'No se pudo consultar el historial.'
    );
  } finally {
    setLoadingHistory(false);
  }
  };


  // DEPÓSITOS, RETIROS Y TRANSFERENCIAS
  const handleOperation = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setOperationError('');
    setOperationMessage('');

    const token = localStorage.getItem('fintech_token');

    const activeAccounts = accounts.filter(
      account => account.status === 'ACTIVE'
    );

    const selectedSourceId =
      sourceAccountId || activeAccounts[0]?.id || '';

    const amount = Number(operationAmount);

    if (!token || !selectedSourceId) {
      setOperationError('Selecciona una cuenta de origen activa.');
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setOperationError('Introduce un monto válido.');
      return;
    }

    if (
      operationType === 'transfer' &&
      (!destinationAccountId ||
        destinationAccountId === selectedSourceId)
    ) {
      setOperationError('Selecciona una cuenta de destino diferente.');
      return;
    }

    const payload =
      operationType === 'transfer'
        ? {
            sourceAccountId: selectedSourceId,
            destinationAccountId,
            amount,
            description: 'Transferencia desde Fintech Core',
          }
        : {
            accountId: selectedSourceId,
            amount,
          };

    setOperationLoading(true);

    try {
      const result = await apiRequest<ApiResponse<unknown>>(
        `/transactions/${operationType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      // Actualizar las cuentas después de la operación
      const accountsResult = await apiRequest<ApiResponse<Account[]>>(
        '/accounts',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAccounts(accountsResult.data || []);

      setOperationMessage(
        result.message || 'Operación realizada correctamente.'
      );

      setOperationAmount('');
    } catch (err) {
      setOperationError(
        err instanceof Error
          ? err.message
          : 'No fue posible realizar la operación.'
      );
    } finally {
      setOperationLoading(false);
    }
  };

  // CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem('fintech_token');
    localStorage.removeItem('fintech_user');

    setUser(null);
    setAccounts([]);
    setPassword('');
    setMessage('');
    setOperationMessage('');
    setOperationError('');
  };

  // PANTALLA DE AUTENTICACIÓN
  if (!user) {
    return (
      <main className="auth-container">
        <section className="auth-card">

          <div className="brand">
            <div className="brand-icon">F</div>
            <h2>Fintech<span>Core</span></h2>
          </div>

          <div className="auth-heading">
            <p className="eyebrow">TU BANCA DIGITAL</p>

            <h1>
              {mode === 'login'
                ? 'Bienvenido de nuevo'
                : 'Crea tu cuenta'}
            </h1>

            <p>
              {mode === 'login'
                ? 'Accede a tu espacio financiero.'
                : 'Comienza a gestionar tus finanzas.'}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => {
                setMode('login');
                setError('');
                setMessage('');
              }}
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              className={mode === 'register' ? 'active' : ''}
              onClick={() => {
                setMode('register');
                setError('');
                setMessage('');
              }}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="feedback error">{error}</div>
          )}

          {message && (
            <div className="feedback success">{message}</div>
          )}

          <form onSubmit={handleSubmit}>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>

                <input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  minLength={3}
                  maxLength={100}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>

              <input
                id="email"
                type="email"
                placeholder="nombre@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>

              <input
                id="password"
                type="password"
                placeholder="Introduce tu contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={mode === 'register' ? 8 : 1}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Iniciar sesión'
                  : 'Crear cuenta'}
            </button>

          </form>

          <p className="auth-footer">
            Fintech Core App · Secure Digital Banking
          </p>

        </section>
      </main>
    );
  }

  // DASHBOARD
  return (
    <main className="dashboard">

      <header className="dashboard-header">
        <h2>Fintech<span>Core</span></h2>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </header>

      <section className="welcome-card">

        <p>BIENVENIDO A FINTECH CORE</p>

        <h1>Hola, {user.name}</h1>

        <p>{user.email}</p>

        {/* CUENTAS BANCARIAS */}
        <div className="dashboard-placeholder">

          <div className="accounts-heading">
            <h2>Mis cuentas</h2>

            <button
              className="create-account-button"
              onClick={handleCreateAccount}
              disabled={creatingAccount}
            >
              {creatingAccount ? 'Creando...' : '+ Nueva cuenta'}
            </button>
          </div>

          {accountError && (
            <div className="feedback error">
              {accountError}
            </div>
          )}

          {loadingAccounts && <p>Cargando cuentas...</p>}

          {!loadingAccounts && accounts.length === 0 && (
            <p>
              Todavía no tienes cuentas bancarias.
              ¡Crea tu primera cuenta!
            </p>
          )}

{accountActionError && (
  <div className="feedback error">
    {accountActionError}
  </div>
)}

{accountFeedback && (
  <div className="feedback success">
    {accountFeedback}
  </div>
)}

          
<div className="account-grid">
  {accounts.map(account => (
    <div className="account-card" key={account.id}>
      <p>Cuenta bancaria</p>

      <h3>{account.accountNumber}</h3>

      <h2>
        {new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 2,
        }).format(Number(account.balance))}
      </h2>

      <span
        className={`account-status ${account.status.toLowerCase()}`}
      >
        {account.status === 'ACTIVE' ? 'Activa' : 'Congelada'}
      </span>

      <div className="account-actions">
        <button
          type="button"
          onClick={() => handleRefreshBalance(account.id)}
          disabled={accountActionLoading !== null}
        >
          {accountActionLoading === account.id
            ? 'Procesando...'
            : 'Actualizar saldo'}
        </button>

        <button
          type="button"
          onClick={() => handleToggleAccountStatus(account)}
          disabled={accountActionLoading !== null}
        >
          {account.status === 'ACTIVE'
            ? 'Congelar cuenta'
            : 'Descongelar cuenta'}
        </button>
        <button
            type="button"
            onClick={() => handleLoadHistory(account.id)}
            disabled={loadingHistory}
            >
              {loadingHistory && selectedHistoryAccount === account.id
                ? 'Cargando...'
                : 'Ver movimientos'}
              </button>
      </div>
    </div>
  ))}
</div>


{selectedHistoryAccount && (
  <section className="history-panel">

    <div className="history-heading">
      <div>
        <h2>Historial de movimientos</h2>
        <p>
          Cuenta: {
            accounts.find(
              account => account.id === selectedHistoryAccount
            )?.accountNumber
          }
        </p>
      </div>

      <button
          type="button"
          className="close-history-button"
          onClick={() => {
            setSelectedHistoryAccount(null);
            setTransactions([]);
            setHistoryError('');
          }}
          aria-label="Cerrar historial"
          >
          ×
        </button>
    </div>

    {loadingHistory && (
      <p>Cargando movimientos...</p>
    )}

    {historyError && (
      <div className="feedback error">
        {historyError}
      </div>
    )}

    {!loadingHistory && !historyError && transactions.length === 0 && (
      <p>Esta cuenta todavía no tiene movimientos.</p>
    )}

    {!loadingHistory && transactions.length > 0 && (
      <div className="transaction-list">
        {transactions.map(transaction => {
          const isIncoming =
            transaction.type === 'DEPOSIT' ||
            (
              transaction.type === 'TRANSFER' &&
              transaction.destinationAccountId === selectedHistoryAccount
            );

          const operationName = {
            DEPOSIT: 'Depósito',
            WITHDRAWAL: 'Retiro',
            TRANSFER: 'Transferencia',
          }[transaction.type];

          return (
            <article
              className="transaction-item"
              key={transaction.id}
            >
              <div className="transaction-info">
                <strong>{operationName}</strong>
                <span>{transaction.description}</span>
                <small>
                  {new Date(transaction.createdAt).toLocaleString('es-CO')}
                </small>
              </div>

              <div className="transaction-value">
                <strong className={isIncoming ? 'incoming' : 'outgoing'}>
                  {isIncoming ? '+' : '-'}
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 2,
                  }).format(transaction.amount)}
                </strong>

                <span>{transaction.status}</span>
              </div>
            </article>
          );
        })}
      </div>
    )}

  </section>
)}



          {/* OPERACIONES FINANCIERAS */}
          <div className="operations-panel">

            <h2>Operaciones bancarias</h2>

            {operationError && (
              <div className="feedback error">
                {operationError}
              </div>
            )}

            {operationMessage && (
              <div className="feedback success">
                {operationMessage}
              </div>
            )}

            <form onSubmit={handleOperation}>

              <div className="form-group">
                <label htmlFor="operationType">
                  Tipo de operación
                </label>

                <select
                  id="operationType"
                  value={operationType}
                  onChange={e => {
                    setOperationType(e.target.value as OperationType);
                    setOperationError('');
                    setOperationMessage('');
                  }}
                >
                  <option value="deposit">Depósito</option>
                  <option value="withdrawal">Retiro</option>
                  <option value="transfer">Transferencia</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sourceAccount">
                  Cuenta de origen
                </label>

                <select
                  id="sourceAccount"
                  value={sourceAccountId || accounts.find(
                    account => account.status === 'ACTIVE'
                  )?.id || ''}
                  onChange={e => setSourceAccountId(e.target.value)}
                  required
                >
                  <option value="">Seleccionar cuenta</option>

                  {accounts
                    .filter(account => account.status === 'ACTIVE')
                    .map(account => (
                      <option key={account.id} value={account.id}>
                        {account.accountNumber}
                      </option>
                    ))}
                </select>
              </div>

              {operationType === 'transfer' && (
                <div className="form-group">
                  <label htmlFor="destinationAccount">
                    Cuenta de destino
                  </label>

                  <select
                    id="destinationAccount"
                    value={destinationAccountId}
                    onChange={e => setDestinationAccountId(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar cuenta</option>

                    {accounts
                      .filter(account =>
                        account.status === 'ACTIVE' &&
                        account.id !== (
                          sourceAccountId ||
                          accounts.find(a => a.status === 'ACTIVE')?.id
                        )
                      )
                      .map(account => (
                        <option key={account.id} value={account.id}>
                          {account.accountNumber}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="operationAmount">
                  Monto (COP)
                </label>

                <input
                  id="operationAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Ej. 50000"
                  value={operationAmount}
                  onChange={e => setOperationAmount(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={
                  operationLoading ||
                  accounts.filter(a => a.status === 'ACTIVE').length === 0
                }
              >
                {operationLoading
                  ? 'Procesando...'
                  : 'Ejecutar operación'}
              </button>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}

export default App;
