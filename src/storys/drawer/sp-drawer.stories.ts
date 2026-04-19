import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/drawer/sp-drawer.js";

const meta: Meta = {
  title: "Components/Drawer",
  component: "sp-drawer",
  tags: ["autodocs"],
  argTypes: {
    open:              { control: "boolean" },
    label:             { control: "text" },
    subtitle:          { control: "text" },
    placement:         { control: "select", options: ["right","left","top","bottom"] },
    size:              { control: "select", options: ["sm","md","lg","xl","full"] },
    closable:          { control: "boolean" },
    loading:           { control: "boolean" },
    "no-overlay":      { control: "boolean" },
    "close-on-overlay":{ control: "boolean" },
  },
  args: { open: true, label: "Configuración", subtitle: "", placement: "right", size: "md", closable: true, loading: false, "no-overlay": false, "close-on-overlay": true },
  render: ({ open, label, subtitle, placement, size, closable, loading }: any) => html`
    <sp-drawer
      ?open=${open}
      label=${label}
      subtitle=${subtitle || ""}
      placement=${placement}
      size=${size}
      ?closable=${closable}
      ?loading=${loading}
    >
      <div style="padding:16px;">
        <p style="margin:0 0 12px;color:#374151;">Contenido del drawer. Puede contener formularios, listas u otros componentes.</p>
        <p style="margin:0;color:#6b7280;font-size:14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </sp-drawer>
  `,
};

export default meta;
type Story = StoryObj;

export const Right: Story = { args: { placement: "right" } };
export const Left: Story = { args: { placement: "left" } };
export const Top: Story = { args: { placement: "top" } };
export const Bottom: Story = { args: { placement: "bottom" } };
export const Large: Story = { args: { size: "lg" } };
export const Small: Story = { args: { size: "sm" } };

export const WithFooter: Story = {
  render: () => html`
    <sp-drawer open label="Editar perfil" placement="right" size="md" closable>
      <div style="padding:16px;display:flex;flex-direction:column;gap:12px;">
        <div>
          <label style="font-size:13px;font-weight:500;display:block;margin-bottom:4px;">Nombre</label>
          <input type="text" value="Ana García" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;font-size:14px;box-sizing:border-box;" />
        </div>
        <div>
          <label style="font-size:13px;font-weight:500;display:block;margin-bottom:4px;">Email</label>
          <input type="email" value="ana@empresa.com" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;font-size:14px;box-sizing:border-box;" />
        </div>
      </div>
      <div slot="footer" style="display:flex;gap:8px;justify-content:flex-end;padding:16px;border-top:1px solid #e5e7eb;">
        <button style="padding:8px 16px;border:1px solid #d1d5db;background:white;border-radius:4px;cursor:pointer;">Cancelar</button>
        <button style="padding:8px 16px;background:#3b82f6;color:white;border:none;border-radius:4px;cursor:pointer;">Guardar</button>
      </div>
    </sp-drawer>
  `,
};

export const NavigationDrawer: Story = {
  name: "Navegación lateral",
  render: () => html`
    <sp-drawer open label="" placement="left" size="sm" closable>
      <div style="padding:0;">
        <div style="padding:20px 16px;border-bottom:1px solid #f3f4f6;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;">
              <span style="color:white;font-size:16px;font-weight:700;">S</span>
            </div>
            <div>
              <p style="margin:0;font-size:14px;font-weight:700;color:#111827;">SP Admin</p>
              <p style="margin:0;font-size:11px;color:#6b7280;">v2.1.0</p>
            </div>
          </div>
        </div>
        <nav style="padding:12px 8px;">
          ${[
            { icon: "🏠", label: "Dashboard", active: true },
            { icon: "👥", label: "Usuarios", active: false },
            { icon: "📊", label: "Reportes", active: false },
            { icon: "🛍️", label: "Productos", active: false },
            { icon: "💳", label: "Pagos", active: false },
            { icon: "⚙️", label: "Configuración", active: false },
          ].map(({ icon, label, active }) => html`
            <a href="#" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;text-decoration:none;margin-bottom:2px;background:${active ? '#eff6ff' : 'transparent'};color:${active ? '#3b82f6' : '#374151'};font-size:14px;font-weight:${active ? '600' : '400'};"
              onmouseenter="if(!${active})this.style.background='#f9fafb'"
              onmouseleave="if(!${active})this.style.background='transparent'">
              <span style="font-size:16px;">${icon}</span>
              ${label}
            </a>
          `)}
        </nav>
        <div style="padding:8px 16px;margin:0 8px;border-top:1px solid #f3f4f6;">
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;"
            onmouseenter="this.style.background='#fef2f2'" onmouseleave="this.style.background='transparent'">
            <span style="font-size:16px;">🚪</span>
            <span style="font-size:14px;color:#ef4444;font-weight:500;">Cerrar sesión</span>
          </div>
        </div>
      </div>
    </sp-drawer>
  `,
};

export const FilterPanel: Story = {
  name: "Panel de filtros",
  render: () => html`
    <sp-drawer open label="Filtrar resultados" placement="right" size="sm" closable>
      <div style="padding:16px;display:flex;flex-direction:column;gap:20px;">
        <div>
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151;">Categoría</p>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${[
              { label: "Electrónica", count: 142, checked: true },
              { label: "Ropa y moda", count: 89, checked: false },
              { label: "Hogar", count: 234, checked: true },
              { label: "Deportes", count: 67, checked: false },
            ].map(({ label, count, checked }) => html`
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;color:#374151;">
                <input type="checkbox" ?checked=${checked} style="width:15px;height:15px;accent-color:#6366f1;" />
                ${label}
                <span style="margin-left:auto;font-size:12px;color:#9ca3af;">${count}</span>
              </label>
            `)}
          </div>
        </div>
        <div>
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151;">Precio</p>
          <div style="display:flex;gap:8px;align-items:center;">
            <input type="number" placeholder="Min" value="0" style="width:50%;padding:8px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;" />
            <span style="color:#9ca3af;">—</span>
            <input type="number" placeholder="Max" value="500" style="width:50%;padding:8px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;" />
          </div>
        </div>
        <div>
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151;">Valoración</p>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${[5, 4, 3, 2].map(stars => html`
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;">
                <input type="radio" name="rating" style="accent-color:#6366f1;" />
                <span style="color:#f59e0b;">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span>
                <span style="color:#6b7280;">y más</span>
              </label>
            `)}
          </div>
        </div>
      </div>
      <div slot="footer" style="padding:14px 16px;border-top:1px solid #e5e7eb;display:flex;gap:8px;">
        <button style="flex:1;padding:9px;border:1px solid #d1d5db;background:white;border-radius:6px;cursor:pointer;font-size:14px;">Limpiar</button>
        <button style="flex:2;padding:9px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;">Aplicar filtros</button>
      </div>
    </sp-drawer>
  `,
};

export const ShoppingCartDrawer: Story = {
  name: "Carrito de compras",
  render: () => html`
    <sp-drawer open label="Tu carrito" placement="right" size="md" closable>
      <div style="padding:16px;display:flex;flex-direction:column;gap:14px;">
        ${[
          { name: "Auriculares Pro X", sku: "SKU-001", price: "$89.00", qty: 1, color: "#3b82f6" },
          { name: "Teclado Mecánico RGB", sku: "SKU-042", price: "$149.00", qty: 2, color: "#8b5cf6" },
          { name: "Mouse Ergonómico", sku: "SKU-018", price: "$45.00", qty: 1, color: "#10b981" },
        ].map(({ name, sku, price, qty, color }) => html`
          <div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #f3f4f6;border-radius:10px;background:#fafafa;">
            <div style="width:48px;height:48px;border-radius:8px;background:${color}22;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:22px;">🛍️</div>
            <div style="flex:1;min-width:0;">
              <p style="margin:0;font-size:13px;font-weight:600;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</p>
              <p style="margin:2px 0 0;font-size:11px;color:#9ca3af;">${sku}</p>
              <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
                <button style="width:22px;height:22px;border:1px solid #e5e7eb;background:white;border-radius:4px;cursor:pointer;font-size:13px;">−</button>
                <span style="font-size:13px;font-weight:600;">${qty}</span>
                <button style="width:22px;height:22px;border:1px solid #e5e7eb;background:white;border-radius:4px;cursor:pointer;font-size:13px;">+</button>
              </div>
            </div>
            <p style="margin:0;font-size:14px;font-weight:700;color:#111827;flex-shrink:0;">${price}</p>
          </div>
        `)}
        <div style="padding:12px;background:#f0fdf4;border-radius:8px;border:1px dashed #86efac;display:flex;align-items:center;gap:8px;">
          <span style="font-size:16px;">🎁</span>
          <div>
            <p style="margin:0;font-size:13px;font-weight:600;color:#16a34a;">¡Envío gratis!</p>
            <p style="margin:0;font-size:12px;color:#4ade80;">Pedidos mayores a $100</p>
          </div>
        </div>
      </div>
      <div slot="footer" style="padding:16px;border-top:1px solid #e5e7eb;display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;">
          <span>Subtotal (3 items)</span><span>$332.00</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;">
          <span>Envío</span><span style="color:#10b981;">Gratis</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:700;color:#111827;padding-top:8px;border-top:1px solid #e5e7eb;">
          <span>Total</span><span>$332.00</span>
        </div>
        <button style="padding:12px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-size:15px;font-weight:600;">Finalizar compra →</button>
      </div>
    </sp-drawer>
  `,
};

export const WithSubtitle: Story = {
  name: "Con subtítulo",
  render: () => html`
    <div style="display:flex;gap:20px;flex-wrap:wrap;">
      <sp-drawer open label="Configuración de cuenta" subtitle="Administra tu perfil y preferencias" placement="right" size="md" closable>
        <div style="padding:16px;display:flex;flex-direction:column;gap:16px;">
          <div style="display:flex;align-items:center;gap:12px;padding:14px;border:1px solid #f3f4f6;border-radius:10px;background:#fafafa;">
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="color:white;font-size:18px;font-weight:700;">AG</span>
            </div>
            <div>
              <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">Ana García</p>
              <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">ana@empresa.com · Admin</p>
            </div>
          </div>
          ${[
            { label: "Nombre completo", value: "Ana García", type: "text" },
            { label: "Email", value: "ana@empresa.com", type: "email" },
            { label: "Zona horaria", value: "América/México_Ciudad", type: "text" },
          ].map(({ label, value, type }) => html`
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em;">${label}</label>
              <input type=${type} value=${value} style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;color:#111827;" />
            </div>
          `)}
        </div>
        <div slot="footer" style="display:flex;gap:8px;justify-content:flex-end;">
          <button style="padding:9px 18px;border:1px solid #d1d5db;background:white;border-radius:6px;cursor:pointer;font-size:14px;">Cancelar</button>
          <button style="padding:9px 18px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;">Guardar cambios</button>
        </div>
      </sp-drawer>
    </div>
  `,
};

export const LoadingState: Story = {
  name: "Estado de carga",
  render: () => html`
    <div style="display:flex;gap:20px;flex-wrap:wrap;">
      <div>
        <p style="font-size:12px;color:#6b7280;margin:0 0 8px;font-weight:500;">loading=true</p>
        <sp-drawer open label="Cargando datos" subtitle="Espere mientras obtenemos la información" placement="right" size="md" closable loading>
          <div style="padding:16px;display:flex;flex-direction:column;gap:12px;">
            ${[60, 80, 45, 70, 55].map(w => html`
              <div style="height:12px;background:#e5e7eb;border-radius:4px;width:${w}%;"></div>
            `)}
          </div>
        </sp-drawer>
      </div>
    </div>
  `,
};

export const LoadingInteractive: Story = {
  name: "Carga con toggle",
  render: () => {
    let isLoading = true;
    return html`
      <div>
        <button
          id="toggle-loading"
          style="margin-bottom:12px;padding:8px 16px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;"
          @click=${() => {
            const drawer = document.querySelector("#loading-drawer") as any;
            if (drawer) { isLoading = !isLoading; drawer.loading = isLoading; }
          }}
        >
          Toggle loading
        </button>
        <sp-drawer id="loading-drawer" open label="Reporte Q1 2026" subtitle="Generando análisis de datos..." placement="right" size="md" closable loading>
          <div style="padding:16px;display:flex;flex-direction:column;gap:14px;">
            <div style="padding:16px;background:#f9fafb;border-radius:10px;border:1px solid #f3f4f6;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#111827;">Ingresos totales</p>
              <p style="margin:0;font-size:24px;font-weight:800;color:#6366f1;">$84,250</p>
            </div>
            <div style="padding:16px;background:#f9fafb;border-radius:10px;border:1px solid #f3f4f6;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#111827;">Usuarios activos</p>
              <p style="margin:0;font-size:24px;font-weight:800;color:#10b981;">12,847</p>
            </div>
          </div>
        </sp-drawer>
      </div>
    `;
  },
};

export const NoOverlayPanel: Story = {
  name: "Sin overlay (modo panel)",
  render: () => html`
    <div style="position:relative;height:400px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#f9fafb;">
      <div style="padding:24px;padding-right:280px;">
        <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#111827;">Vista principal</p>
        <p style="margin:0;font-size:14px;color:#6b7280;">El drawer sin overlay no bloquea la interacción con el contenido subyacente. Útil para paneles de filtro, configuración secundaria o inspección de propiedades.</p>
        <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px;">
          ${[1,2,3].map(n => html`
            <div style="padding:12px;background:white;border-radius:8px;border:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;font-weight:600;color:#374151;">Registro #${n}</p>
              <p style="margin:3px 0 0;font-size:12px;color:#9ca3af;">Click en el panel para editar</p>
            </div>
          `)}
        </div>
      </div>
      <sp-drawer open label="Propiedades" subtitle="Selecciona un registro" placement="right" size="sm" closable no-overlay
        style="--sp-drawer-size:260px;">
        <div style="padding:12px;display:flex;flex-direction:column;gap:10px;">
          ${[
            { key: "ID", value: "#rec-001" },
            { key: "Estado", value: "Activo" },
            { key: "Creado", value: "19 abr 2026" },
            { key: "Modificado", value: "Hace 2 horas" },
          ].map(({ key, value }) => html`
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;">
              <span style="color:#6b7280;font-weight:500;">${key}</span>
              <span style="color:#111827;font-weight:600;">${value}</span>
            </div>
          `)}
          <hr style="border:none;border-top:1px solid #f3f4f6;margin:4px 0;" />
          <button style="width:100%;padding:8px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;">Editar registro</button>
          <button style="width:100%;padding:8px;background:#fef2f2;color:#ef4444;border:1px solid #fecaca;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;">Eliminar</button>
        </div>
      </sp-drawer>
    </div>
  `,
};

export const SwipeToClose: Story = {
  name: "Swipe para cerrar (touch)",
  render: () => html`
    <div style="max-width:480px;">
      <div style="padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin-bottom:12px;">
        <p style="margin:0;font-size:13px;color:#92400e;">
          📱 En dispositivos táctiles: desliza el panel hacia abajo (bottom) o hacia los lados (left/right) más de 80px para cerrarlo.
        </p>
      </div>
      <sp-drawer open label="Panel inferior" subtitle="Desliza hacia abajo para cerrar" placement="bottom" size="sm" closable>
        <div style="padding:16px;text-align:center;">
          <span style="font-size:32px;">👆</span>
          <p style="margin:8px 0 0;font-size:14px;color:#374151;font-weight:500;">Arrastra este panel hacia abajo</p>
          <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">El gesto táctil cierra el drawer al superar 80px de desplazamiento</p>
        </div>
        <div slot="footer">
          <button style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">Acción principal</button>
        </div>
      </sp-drawer>
    </div>
  `,
};

export const ConfirmDelete: Story = {
  name: "Confirmación de eliminación",
  render: () => html`
    <sp-drawer open label="Eliminar cuenta" subtitle="Esta acción no se puede deshacer" placement="bottom" size="sm" closable>
      <div style="padding:20px;display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;">
        <div style="width:64px;height:64px;border-radius:50%;background:#fef2f2;display:flex;align-items:center;justify-content:center;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <div>
          <p style="margin:0;font-size:16px;font-weight:700;color:#111827;">¿Eliminar cuenta permanentemente?</p>
          <p style="margin:8px 0 0;font-size:14px;color:#6b7280;line-height:1.5;">Se eliminarán todos tus datos, proyectos y configuraciones. Esta acción es <strong>irreversible</strong>.</p>
        </div>
        <div style="width:100%;padding:14px;background:#fef2f2;border-radius:8px;border:1px solid #fecaca;text-align:left;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#ef4444;">Se perderá para siempre:</p>
          ${["24 proyectos activos", "8.4 GB de archivos", "Historial de 3 años", "Integraciones configuradas"].map(item => html`
            <p style="margin:3px 0;font-size:13px;color:#dc2626;display:flex;align-items:center;gap:6px;">
              <span style="color:#ef4444;">✕</span> ${item}
            </p>
          `)}
        </div>
        <div style="width:100%;">
          <label style="font-size:13px;color:#374151;display:block;margin-bottom:6px;">Escribe <strong>eliminar mi cuenta</strong> para confirmar:</label>
          <input type="text" placeholder="eliminar mi cuenta" style="width:100%;padding:10px 12px;border:1px solid #fca5a5;border-radius:8px;font-size:14px;box-sizing:border-box;background:#fff;" />
        </div>
      </div>
      <div slot="footer" style="display:flex;gap:8px;">
        <button style="flex:1;padding:10px;border:1px solid #d1d5db;background:white;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;">Cancelar</button>
        <button style="flex:1;padding:10px;background:#ef4444;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">Eliminar cuenta</button>
      </div>
    </sp-drawer>
  `,
};

export const NotificationsDrawer: Story = {
  name: "Centro de notificaciones",
  render: () => html`
    <sp-drawer open label="Notificaciones" subtitle="4 sin leer" placement="right" size="md" closable>
      <div style="padding:0;">
        <div style="padding:12px 16px;border-bottom:1px solid #f3f4f6;display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;gap:8px;">
            ${["Todas", "Sin leer", "Menciones"].map((tab, i) => html`
              <button style="padding:5px 12px;border-radius:20px;border:none;cursor:pointer;font-size:12px;font-weight:600;background:${i===0?'#6366f1':'transparent'};color:${i===0?'white':'#6b7280'};">${tab}</button>
            `)}
          </div>
          <button style="font-size:12px;color:#6366f1;background:none;border:none;cursor:pointer;font-weight:500;">Marcar todo como leído</button>
        </div>
        <div style="display:flex;flex-direction:column;">
          ${[
            { icon: "💬", title: "Carlos comentó en tu PR", sub: "\"Buen trabajo, solo un pequeño ajuste...\"", time: "hace 5 min", unread: true, color: "#3b82f6" },
            { icon: "✅", title: "Deploy exitoso en producción", sub: "sp-component v2.1.0 desplegado correctamente", time: "hace 23 min", unread: true, color: "#10b981" },
            { icon: "⚠️", title: "Límite de almacenamiento al 90%", sub: "Quedan solo 850 MB disponibles", time: "hace 1h", unread: true, color: "#f59e0b" },
            { icon: "👤", title: "María te mencionó en un comentario", sub: "@tú revisa este componente antes del lunes", time: "hace 2h", unread: true, color: "#8b5cf6" },
            { icon: "🔔", title: "Nueva versión disponible", sub: "Actualización v2.2.0 lista para instalar", time: "ayer", unread: false, color: "#6b7280" },
            { icon: "📊", title: "Reporte semanal generado", sub: "Tu resumen del 14-19 abr está listo", time: "ayer", unread: false, color: "#6b7280" },
          ].map(({ icon, title, sub, time, unread, color }) => html`
            <div style="display:flex;gap:12px;padding:14px 16px;border-bottom:1px solid #f9fafb;background:${unread ? '#fafbff' : 'white'};cursor:pointer;transition:background .12s;"
              onmouseenter="this.style.background='#f5f3ff'" onmouseleave="this.style.background='${unread ? '#fafbff' : 'white'}'">
              ${unread ? html`<div style="width:6px;height:6px;border-radius:50%;background:${color};margin-top:8px;flex-shrink:0;"></div>` : html`<div style="width:6px;flex-shrink:0;"></div>`}
              <div style="width:36px;height:36px;border-radius:10px;background:${color}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">${icon}</div>
              <div style="flex:1;min-width:0;">
                <p style="margin:0;font-size:13px;font-weight:${unread?'600':'400'};color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</p>
                <p style="margin:2px 0 0;font-size:12px;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sub}</p>
                <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;">${time}</p>
              </div>
            </div>
          `)}
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <button style="font-size:13px;color:#6366f1;background:none;border:none;cursor:pointer;font-weight:600;">Ver todas las notificaciones →</button>
      </div>
    </sp-drawer>
  `,
};

export const OrderDetails: Story = {
  name: "Detalle de pedido",
  render: () => html`
    <sp-drawer open label="Pedido #ORD-2847" subtitle="Realizado el 19 de abril, 2026" placement="right" size="lg" closable>
      <div style="padding:16px;display:flex;flex-direction:column;gap:20px;">
        <!-- Estado -->
        <div style="padding:14px;border-radius:10px;background:#f0fdf4;border:1px solid #bbf7d0;display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="2 8 6 12 14 4"/></svg>
          </div>
          <div>
            <p style="margin:0;font-size:14px;font-weight:700;color:#16a34a;">Pedido entregado</p>
            <p style="margin:2px 0 0;font-size:12px;color:#4ade80;">Hoy, 14:32 — Firma: Ana García</p>
          </div>
        </div>
        <!-- Timeline -->
        <div>
          <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#374151;">Seguimiento</p>
          <div style="display:flex;flex-direction:column;gap:0;">
            ${[
              { label: "Pedido recibido", date: "19 abr · 09:15", done: true },
              { label: "Pago confirmado", date: "19 abr · 09:17", done: true },
              { label: "En preparación", date: "19 abr · 10:30", done: true },
              { label: "En camino", date: "19 abr · 13:00", done: true },
              { label: "Entregado", date: "19 abr · 14:32", done: true },
            ].map(({ label, date, done }, i, arr) => html`
              <div style="display:flex;gap:12px;position:relative;">
                <div style="display:flex;flex-direction:column;align-items:center;">
                  <div style="width:20px;height:20px;border-radius:50%;background:${done?'#10b981':'#e5e7eb'};display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;">
                    ${done ? html`<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><polyline points="1.5 5 4 7.5 8.5 2.5"/></svg>` : ''}
                  </div>
                  ${i < arr.length - 1 ? html`<div style="width:2px;height:28px;background:${done?'#bbf7d0':'#f3f4f6'};margin:2px 0;"></div>` : ''}
                </div>
                <div style="padding-bottom:${i < arr.length-1 ? '0' : '0'};padding-top:1px;">
                  <p style="margin:0;font-size:13px;font-weight:${done?'600':'400'};color:${done?'#111827':'#9ca3af'};">${label}</p>
                  <p style="margin:1px 0 ${i < arr.length-1 ? '12px' : '0'};font-size:11px;color:#9ca3af;">${date}</p>
                </div>
              </div>
            `)}
          </div>
        </div>
        <!-- Productos -->
        <div>
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151;">Productos (3)</p>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${[
              { name: "Auriculares Pro X", qty: 1, price: "$89.00", emoji: "🎧" },
              { name: "Teclado Mecánico RGB", qty: 2, price: "$298.00", emoji: "⌨️" },
              { name: "Mouse Ergonómico", qty: 1, price: "$45.00", emoji: "🖱️" },
            ].map(({ name, qty, price, emoji }) => html`
              <div style="display:flex;align-items:center;gap:10px;padding:10px;border:1px solid #f3f4f6;border-radius:8px;background:#fafafa;">
                <span style="font-size:22px;">${emoji}</span>
                <div style="flex:1;">
                  <p style="margin:0;font-size:13px;font-weight:500;color:#111827;">${name}</p>
                  <p style="margin:2px 0 0;font-size:12px;color:#9ca3af;">Cant: ${qty}</p>
                </div>
                <span style="font-size:13px;font-weight:700;color:#111827;">${price}</span>
              </div>
            `)}
          </div>
        </div>
        <!-- Resumen -->
        <div style="border-top:1px solid #f3f4f6;padding-top:14px;display:flex;flex-direction:column;gap:8px;">
          ${[
            { label: "Subtotal", value: "$432.00" },
            { label: "Envío", value: "Gratis", green: true },
            { label: "IVA (16%)", value: "$69.12" },
          ].map(({ label, value, green }: any) => html`
            <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;">
              <span>${label}</span><span style="color:${green?'#10b981':'inherit'};font-weight:${green?'600':'400'};">${value}</span>
            </div>
          `)}
          <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:#111827;padding-top:8px;border-top:1px solid #f3f4f6;">
            <span>Total</span><span>$501.12</span>
          </div>
        </div>
      </div>
      <div slot="footer" style="display:flex;gap:8px;">
        <button style="flex:1;padding:10px;border:1px solid #d1d5db;background:white;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;">Descargar factura</button>
        <button style="flex:1;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">Repetir pedido</button>
      </div>
    </sp-drawer>
  `,
};

export const ActivityFeed: Story = {
  name: "Historial de actividad",
  render: () => html`
    <sp-drawer open label="Actividad reciente" subtitle="Últimos 7 días" placement="right" size="md" closable>
      <div style="padding:0 16px;">
        ${[
          {
            date: "Hoy",
            events: [
              { user: "Ana G.", avatar: "AG", color: "#6366f1", action: "desplegó", target: "v2.1.0 en producción", time: "14:32", icon: "🚀" },
              { user: "Carlos L.", avatar: "CL", color: "#0ea5e9", action: "aprobó el PR", target: "#284 — sp-drawer swipe", time: "12:10", icon: "✅" },
              { user: "Sistema", avatar: "SY", color: "#10b981", action: "ejecutó tests automáticos", target: "98% passed (312/318)", time: "11:55", icon: "🧪" },
            ]
          },
          {
            date: "Ayer",
            events: [
              { user: "María R.", avatar: "MR", color: "#ec4899", action: "creó el issue", target: "#302 — Focus trap en drawer", time: "17:20", icon: "🐛" },
              { user: "Ana G.", avatar: "AG", color: "#6366f1", action: "actualizó el componente", target: "sp-spinner — 5 variantes", time: "15:00", icon: "✏️" },
              { user: "Carlos L.", avatar: "CL", color: "#0ea5e9", action: "cerró el milestone", target: "v2.1.0 — 24 issues", time: "09:30", icon: "🎯" },
            ]
          },
        ].map(({ date, events }) => html`
          <div style="margin-top:16px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.08em;">${date}</p>
            <div style="display:flex;flex-direction:column;gap:2px;">
              ${events.map(({ user, avatar, color, action, target, time, icon }) => html`
                <div style="display:flex;align-items:flex-start;gap:10px;padding:10px;border-radius:8px;cursor:default;transition:background .12s;"
                  onmouseenter="this.style.background='#f9fafb'" onmouseleave="this.style.background='transparent'">
                  <div style="width:32px;height:32px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;font-weight:700;color:white;">${avatar}</div>
                  <div style="flex:1;min-width:0;">
                    <p style="margin:0;font-size:13px;color:#374151;line-height:1.4;">
                      <strong style="color:#111827;">${user}</strong> ${action}
                      <span style="font-style:italic;color:#6b7280;"> ${target}</span>
                    </p>
                    <p style="margin:3px 0 0;font-size:11px;color:#9ca3af;">${time}</p>
                  </div>
                  <span style="font-size:16px;flex-shrink:0;">${icon}</span>
                </div>
              `)}
            </div>
          </div>
        `)}
      </div>
      <div slot="footer" style="text-align:center;">
        <button style="font-size:13px;color:#6366f1;background:none;border:none;cursor:pointer;font-weight:600;">Ver historial completo →</button>
      </div>
    </sp-drawer>
  `,
};

export const MultiStep: Story = {
  name: "Formulario multi-paso",
  render: () => {
    let step = 1;
    const totalSteps = 3;
    const stepLabels = ["Datos personales", "Empresa", "Confirmación"];

    const renderStep = (container: HTMLElement) => {
      const body = container.querySelector(".step-body") as HTMLElement;
      const footer = container.querySelector(".step-footer") as HTMLElement;
      const progress = container.querySelector(".step-progress") as HTMLElement;
      if (!body || !footer || !progress) return;

      progress.innerHTML = stepLabels.map((label, i) => `
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;">
          <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;
            background:${i + 1 < step ? '#10b981' : i + 1 === step ? '#6366f1' : '#e5e7eb'};
            color:${i + 1 <= step ? 'white' : '#9ca3af'};">
            ${i + 1 < step ? '✓' : i + 1}
          </div>
          <span style="font-size:10px;color:${i + 1 === step ? '#6366f1' : '#9ca3af'};font-weight:${i + 1 === step ? '600' : '400'};text-align:center;">${label}</span>
        </div>
        ${i < stepLabels.length - 1 ? `<div style="flex:0.5;height:2px;background:${i + 1 < step ? '#10b981' : '#e5e7eb'};margin-top:14px;"></div>` : ''}
      `).join('');

      const fields: Record<number, string> = {
        1: `
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div><label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Nombre completo</label>
              <input type="text" placeholder="Ana García" style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;" /></div>
            <div><label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Email</label>
              <input type="email" placeholder="ana@empresa.com" style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;" /></div>
            <div><label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Teléfono</label>
              <input type="tel" placeholder="+52 55 1234 5678" style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;" /></div>
          </div>`,
        2: `
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div><label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Nombre de empresa</label>
              <input type="text" placeholder="Acme Inc." style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;" /></div>
            <div><label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Industria</label>
              <select style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;background:white;">
                <option>Tecnología</option><option>Finanzas</option><option>Salud</option><option>Educación</option>
              </select></div>
            <div><label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Tamaño del equipo</label>
              <select style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;background:white;">
                <option>1-10 personas</option><option>11-50 personas</option><option>51-200 personas</option><option>200+ personas</option>
              </select></div>
          </div>`,
        3: `
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="padding:16px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#16a34a;">✓ Todo listo para crear tu cuenta</p>
              <p style="margin:0;font-size:13px;color:#4ade80;">Haz clic en "Crear cuenta" para finalizar el proceso.</p>
            </div>
            ${[{ k: "Nombre", v: "Ana García" }, { k: "Email", v: "ana@empresa.com" }, { k: "Empresa", v: "Acme Inc." }, { k: "Plan", v: "Pro · $29/mes" }].map(({ k, v }) => `
              <div style="display:flex;justify-content:space-between;font-size:13px;padding:8px 0;border-bottom:1px solid #f3f4f6;">
                <span style="color:#6b7280;">${k}</span><span style="font-weight:600;color:#111827;">${v}</span>
              </div>
            `).join('')}
            <label style="display:flex;gap:8px;align-items:flex-start;font-size:13px;color:#374151;cursor:pointer;">
              <input type="checkbox" style="margin-top:2px;accent-color:#6366f1;" />
              Acepto los <a href="#" style="color:#6366f1;">Términos de uso</a> y la <a href="#" style="color:#6366f1;">Política de privacidad</a>
            </label>
          </div>`,
      };

      body.innerHTML = fields[step] ?? "";

      footer.innerHTML = `
        <div style="display:flex;gap:8px;width:100%;">
          ${step > 1 ? `<button id="btn-back" style="flex:1;padding:10px;border:1px solid #d1d5db;background:white;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;">← Anterior</button>` : ''}
          <button id="btn-next" style="flex:2;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">
            ${step < totalSteps ? 'Siguiente →' : 'Crear cuenta ✓'}
          </button>
        </div>`;

      footer.querySelector("#btn-next")?.addEventListener("click", () => {
        if (step < totalSteps) { step++; renderStep(container); }
      });
      footer.querySelector("#btn-back")?.addEventListener("click", () => {
        if (step > 1) { step--; renderStep(container); }
      });
    };

    return html`
      <sp-drawer open label="Crear cuenta" subtitle="Paso ${step} de ${totalSteps}" placement="right" size="md" closable
        ${(el: any) => el && setTimeout(() => renderStep(el), 0)}>
        <div style="padding:16px;display:flex;flex-direction:column;gap:16px;">
          <div class="step-progress" style="display:flex;align-items:flex-start;gap:0;margin-bottom:4px;"></div>
          <div class="step-body"></div>
        </div>
        <div slot="footer" style="width:100%;"><div class="step-footer" style="display:flex;width:100%;gap:8px;"></div></div>
      </sp-drawer>
    `;
  },
};

export const ThemeSelector: Story = {
  name: "Selector de tema",
  render: () => html`
    <sp-drawer open label="Apariencia" subtitle="Personaliza la interfaz a tu gusto" placement="right" size="sm" closable>
      <div style="padding:16px;display:flex;flex-direction:column;gap:22px;">
        <!-- Modo -->
        <div>
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151;">Modo</p>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${[
              { label: "Claro", icon: "☀️", active: true },
              { label: "Oscuro", icon: "🌙", active: false },
              { label: "Sistema", icon: "💻", active: false },
            ].map(({ label, icon, active }) => html`
              <div style="padding:14px 8px;border-radius:10px;border:2px solid ${active?'#6366f1':'#e5e7eb'};text-align:center;cursor:pointer;background:${active?'#f5f3ff':'white'};transition:all .15s;"
                onmouseenter="if(!${active})this.style.borderColor='#c7d2fe'" onmouseleave="if(!${active})this.style.borderColor='#e5e7eb'">
                <div style="font-size:22px;margin-bottom:6px;">${icon}</div>
                <p style="margin:0;font-size:12px;font-weight:${active?'700':'500'};color:${active?'#6366f1':'#374151'};">${label}</p>
              </div>
            `)}
          </div>
        </div>
        <!-- Color de acento -->
        <div>
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151;">Color de acento</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${[
              { color: "#6366f1", name: "Índigo", active: true },
              { color: "#3b82f6", name: "Azul", active: false },
              { color: "#10b981", name: "Verde", active: false },
              { color: "#f59e0b", name: "Ámbar", active: false },
              { color: "#ef4444", name: "Rojo", active: false },
              { color: "#ec4899", name: "Rosa", active: false },
              { color: "#0f172a", name: "Pizarra", active: false },
            ].map(({ color, name, active }) => html`
              <div title=${name} style="display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;">
                <div style="width:34px;height:34px;border-radius:50%;background:${color};border:3px solid ${active?'#111827':'transparent'};box-shadow:${active?`0 0 0 1px ${color}`:'none'};transition:all .15s;"></div>
                <span style="font-size:10px;color:${active?'#111827':'#9ca3af'};font-weight:${active?'600':'400'};">${name}</span>
              </div>
            `)}
          </div>
        </div>
        <!-- Densidad -->
        <div>
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151;">Densidad de la interfaz</p>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${[
              { label: "Compacta", desc: "Más información en menos espacio", active: false },
              { label: "Normal", desc: "Balance entre densidad y legibilidad", active: true },
              { label: "Espaciada", desc: "Más espacio, mejor para presentaciones", active: false },
            ].map(({ label, desc, active }) => html`
              <label style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;border:1px solid ${active?'#6366f1':'#f3f4f6'};background:${active?'#f5f3ff':'white'};cursor:pointer;">
                <input type="radio" name="density" ?checked=${active} style="accent-color:#6366f1;" />
                <div>
                  <p style="margin:0;font-size:13px;font-weight:${active?'600':'500'};color:${active?'#6366f1':'#111827'};">${label}</p>
                  <p style="margin:2px 0 0;font-size:11px;color:#9ca3af;">${desc}</p>
                </div>
              </label>
            `)}
          </div>
        </div>
        <!-- Tipografía -->
        <div>
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151;">Tamaño de fuente</p>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:11px;color:#9ca3af;">A</span>
            <input type="range" min="12" max="20" value="14" style="flex:1;accent-color:#6366f1;" />
            <span style="font-size:18px;color:#374151;">A</span>
          </div>
        </div>
      </div>
      <div slot="footer" style="display:flex;gap:8px;">
        <button style="flex:1;padding:9px;border:1px solid #d1d5db;background:white;border-radius:6px;cursor:pointer;font-size:14px;">Restablecer</button>
        <button style="flex:2;padding:9px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;">Guardar preferencias</button>
      </div>
    </sp-drawer>
  `,
};

export const FocusTrap: Story = {
  name: "Focus trap (accesibilidad)",
  render: () => html`
    <div>
      <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">
        Presiona <kbd style="padding:2px 6px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:4px;font-size:12px;">Tab</kbd> para navegar entre los elementos del drawer. El foco no puede salir mientras esté abierto.
      </p>
      <sp-drawer open label="Formulario de contacto" subtitle="Navegación por teclado activa" placement="right" size="md" closable>
        <div style="padding:16px;display:flex;flex-direction:column;gap:12px;">
          ${[
            { label: "Nombre", type: "text", placeholder: "Tu nombre" },
            { label: "Email", type: "email", placeholder: "tu@email.com" },
            { label: "Asunto", type: "text", placeholder: "Asunto del mensaje" },
          ].map(({ label, type, placeholder }) => html`
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">${label}</label>
              <input type=${type} placeholder=${placeholder}
                style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;"
                onfocus="this.style.borderColor='#6366f1';this.style.boxShadow='0 0 0 3px #e0e7ff'"
                onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
            </div>
          `)}
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px;">Mensaje</label>
            <textarea rows="4" placeholder="Escribe tu mensaje..."
              style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;resize:vertical;"
              onfocus="this.style.borderColor='#6366f1';this.style.boxShadow='0 0 0 3px #e0e7ff'"
              onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'"></textarea>
          </div>
        </div>
        <div slot="footer" style="display:flex;gap:8px;">
          <button style="flex:1;padding:9px;border:1px solid #d1d5db;background:white;border-radius:6px;cursor:pointer;font-size:14px;">Cancelar</button>
          <button style="flex:2;padding:9px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;">Enviar mensaje</button>
        </div>
      </sp-drawer>
    </div>
  `,
};
