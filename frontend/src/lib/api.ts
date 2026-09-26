// Cliente HTTP da API Laravel.
// A URL vem de VITE_API_URL (ver .env.example); o token Sanctum fica no localStorage.

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/$/, "");

const TOKEN_KEY = "auth_token";
const USUARIO_KEY = "usuario";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUsuario: () => localStorage.getItem(USUARIO_KEY),
  salvar: (token: string, usuario: unknown) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  },
  limpar: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
  },
};

export class ApiError extends Error {
  constructor(message: string, public status: number, public errors?: Record<string, string[]>) {
    super(message);
  }
}

type Corpo = Record<string, unknown> | FormData | undefined;

async function request(path: string, method: string, body?: Corpo): Promise<Response> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = authStorage.getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Não foi possível conectar à API. Verifique se o backend está em execução.", 0);
  }

  if (res.status === 401 && token) {
    // Token expirado ou revogado: volta para o login
    authStorage.limpar();
    window.location.href = "/login";
  }

  if (!res.ok) {
    let data: { message?: string; errors?: Record<string, string[]> } = {};
    try {
      data = await res.json();
    } catch {
      /* resposta sem JSON */
    }
    const primeiroErro = data.errors ? Object.values(data.errors)[0]?.[0] : undefined;
    throw new ApiError(primeiroErro || data.message || `Erro ${res.status}`, res.status, data.errors);
  }

  return res;
}

export const api = {
  get: async <T = any>(path: string): Promise<T> => (await request(path, "GET")).json(),
  post: async <T = any>(path: string, body?: Corpo): Promise<T> => (await request(path, "POST", body)).json(),
  put: async <T = any>(path: string, body?: Corpo): Promise<T> => (await request(path, "PUT", body)).json(),
  patch: async <T = any>(path: string, body?: Corpo): Promise<T> => (await request(path, "PATCH", body)).json(),
  delete: async <T = any>(path: string): Promise<T> => (await request(path, "DELETE")).json(),
  /** Requisição que devolve um arquivo (ex.: PDF). */
  blob: async (path: string, body?: Corpo): Promise<Blob> =>
    (await request(path, body ? "POST" : "GET", body)).blob(),
};

/** Abre um PDF (Blob) em uma nova aba. */
export function abrirPdf(blob: Blob) {
  window.open(URL.createObjectURL(blob), "_blank");
}

/** URL pública da imagem de um template de papel timbrado (usada como background na pré-visualização). */
export function templateImagemUrl(arquivo: string) {
  return `${API_URL}/templates-pdf/imagem/${encodeURIComponent(arquivo)}`;
}

export function mensagemErro(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}
