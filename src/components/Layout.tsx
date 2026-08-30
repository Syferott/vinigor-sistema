import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/orcamentos', label: 'Orçamentos', icon: '📝' },
  { to: '/faturas', label: 'Faturas', icon: '🧾' },
  { to: '/producao', label: 'Produção', icon: '🏭' },
  { to: '/contas-receber', label: 'Contas a Receber', icon: '💰' },
  { to: '/contas-pagar', label: 'Contas a Pagar', icon: '💸' },
  { to: '/clientes', label: 'Clientes', icon: '👥' },
  { to: '/itens', label: 'Itens', icon: '📦' },
  { to: '/relatorios', label: 'Relatórios', icon: '📈' },
  { to: '/perfil', label: 'Perfil da Empresa', icon: '🏢' },
  { to: '/configuracoes', label: 'Configurações', icon: '⚙️' },
]

const SENHA_RELATORIOS = '2698'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [senha, setSenha] = useState('')

  const { cloudMode, session, signOut } = useAuth()
  const { db, loading } = useData()
  const navigate = useNavigate()

  function abrirRelatorios() {
    setSenha('')
    setMostrarSenha(true)
    setOpen(false)
  }

  function confirmarSenha() {
    if (senha === SENHA_RELATORIOS) {
      setMostrarSenha(false)
      setSenha('')
      navigate('/relatorios')
    } else {
      alert('Senha incorreta.')
      setSenha('')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Botão hambúrguer (mobile) */}
      <button
        className="fixed left-3 top-3 z-40 rounded-lg bg-slate-800 px-3 py-2 text-white shadow-lg lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-slate-900 text-slate-200 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-slate-800 px-5 py-5">
          <h1 className="text-lg font-bold text-white">
            {db.empresa.nome || 'Gráfica Livre'}
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Gestão para gráficas
          </p>
        </div>

        <nav className="mt-2 flex flex-col gap-0.5 px-3">
          {NAV.map((item) => {
            // Relatórios usa senha em vez de navegação direta
            if (item.to === '/relatorios') {
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={abrirRelatorios}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              )
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-600 font-medium text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-slate-800 p-4 text-xs">
          {cloudMode ? (
            <div className="flex items-center justify-between gap-2">
              <span
                className="truncate text-slate-400"
                title={session?.user.email ?? ''}
              >
                {session?.user.email}
              </span>

              <button
                onClick={signOut}
                className="shrink-0 rounded px-2 py-1 text-slate-300 hover:bg-slate-800"
              >
                Sair
              </button>
            </div>
          ) : (
            <span className="text-amber-400">
              ⚠ Modo local — dados apenas neste navegador. Configure o
              Supabase para uso profissional.
            </span>
          )}
        </div>
      </aside>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Conteúdo */}
      <main className="min-w-0 flex-1 px-4 py-6 pt-16 lg:ml-64 lg:px-8 lg:pt-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-slate-500">
            Carregando dados...
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {/* Modal de senha dos Relatórios */}
      {mostrarSenha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-800">
              Acesso aos Relatórios
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Digite a senha para acessar os relatórios.
            </p>

            <input
              type="password"
              autoFocus
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  confirmarSenha()
                }
              }}
              placeholder="Digite a senha"
              className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setMostrarSenha(false)
                  setSenha('')
                }}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarSenha}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
