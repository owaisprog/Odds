// components/admin/ContactMessages.tsx
"use client";

import { useEffect, useState } from "react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string; // ISO from API
  read: boolean;
};

type ListResponse = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  items: ContactMessage[];
};

export default function ContactMessages() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load(p = page) {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/contact?page=${p}&limit=${limit}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const json = (await res.json()) as ListResponse | { error?: string };
      if (!res.ok) throw new Error((json as any)?.error || "Failed to load");
      setData(json as ListResponse);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page !== 1) load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => {
    if (data?.hasMore) setPage((p) => p + 1);
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-5 md:px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#111827]">
            Contact Messages
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            View messages submitted via the site footer.
          </p>
        </div>
        <button
          onClick={() => load(page)}
          className="hidden md:inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#111827] hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="h-4 w-56 rounded bg-gray-200" />
                  <div className="h-4 w-24 rounded bg-gray-200 ml-auto" />
                </div>
                <div className="mt-3 h-3 w-4/5 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && err && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4">
            {err}
          </div>
        )}

        {/* Empty */}
        {!loading && !err && data && data.items.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <p className="text-gray-600">No messages yet.</p>
          </div>
        )}

        {/* Table */}
        {!loading && !err && data && data.items.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th className="w-[45%]">Message</Th>
                  <Th>Received</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.items.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <Td>
                      <div className="font-medium text-[#111827]">{m.name}</div>
                    </Td>
                    <Td>
                      <a
                        href={`mailto:${m.email}`}
                        className="text-[#278394] hover:underline"
                      >
                        {m.email}
                      </a>
                    </Td>
                    <Td>
                      <div className="max-w-[520px] text-gray-700 truncate">
                        {m.message}
                      </div>
                    </Td>
                    <Td>
                      <span className="text-gray-600">
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                    </Td>
                    <Td>
                      {m.read ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs border border-transparent">
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-rose-100 text-rose-700 px-2 py-0.5 text-xs border border-transparent">
                          New
                        </span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer: pagination */}
        {!loading && !err && data && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page <span className="text-[#111827]">{data.page}</span> • Total{" "}
              <span className="text-[#111827]">{data.total}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={onPrev}
                disabled={page <= 1}
                className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-[#111827] disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={onNext}
                disabled={!data.hasMore}
                className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-[#111827] disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* --- tiny table helpers --- */
function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 ${className}`}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
