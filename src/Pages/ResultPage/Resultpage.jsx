import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Search, X, ArrowLeft, Inbox } from "react-feather";
import { useSelector } from "react-redux";
import useApi from "../../auth/service/useApi";
import { useLocation } from "react-router-dom";

const SEARCH_DELAY = 400;

function SearchResultsPage() {
  const api = useApi();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.userListPage);

  const { companySlug, projectSlug } = useParams();

  const initialQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const controllerRef = useRef(null);
  const query = (searchParams.get("q") || "").trim();
  const filterprm = (searchParams.get("filter") || "").trim();
  const tabprm = (searchParams.get("tab") || "").trim();
  const keyprm = (searchParams.get("key") || "").trim();
  const statusprm = (searchParams.get("status") || "").trim();
  const typeprm = (searchParams.get("type") || "").trim();

  // Fetch results whenever the URL's "q" param changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    fetchResults(query);

    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (filterprm) {
      fetchFilterResults(filterprm);
    }
  }, [filterprm]);

  const fetchFilterResults = async (filter) => {
    let payload = {};
    let statustrack = "";
    if (statusprm === "inProgress") {
      statustrack = "in_progress";
    } else if (statusprm == "in_qa") {
      statustrack = "qa";
    }
    if (typeprm) {
      payload.type = typeprm;
      
    }
    payload[keyprm || "filter"] = filter;
    payload.filter = filter;
    if (statusprm) {
      payload.taskStatus = statustrack || statusprm;
    }

    payload.sprintId = currentUser?.preferences?.Activesprint?.sprintId;
    // payload.type = "task";
    try {
      const res = await api.gettask(payload);
      setResults(res?.data?.data || []);
    } catch (err) {
      setError("Something went wrong get response");
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (value) => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await api.gettask({ searchValue: value }, controller.signal);
      setResults(res?.data?.data || []);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        setError("Something went wrong while searching. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounced update of the URL "q" param as the user types
  const handleInputChange = (value) => {
    setInputValue(value);
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (value.trim()) {
        setSearchParams({ q: value });
      } else {
        setSearchParams({});
        setResults([]);
      }
    }, SEARCH_DELAY);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Group results by type for cleaner scanning
  const grouped = results.reduce((acc, item) => {
    const key = item.type || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const handleResultClick = (item) => {
    navigate(`/${companySlug}/${projectSlug}/tasks`, {
      state: { viewtask: item },
    });
  };

  const showEmptyPrompt = !loading && !error && !query;
  const showNoResults = !loading && !error && query && results.length === 0;

  return (
    <div className="sr-page">
      <style>{`
        .sr-page {
          --sr-ink: #1B2538;
          --sr-muted: #6B7785;
          --sr-line: #DDE3EA;
          --sr-accent: #2F6FED;
          --sr-paper: #F7F8FA;

          background: var(--sr-paper);
          color: var(--sr-ink);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          width: 100%;
          padding: 24px 32px 56px;
        }

        .sr-page * { box-sizing: border-box; }

        .sr-container {
          max-width: 100%;
          margin: 0 auto;
        }

        .sr-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--sr-muted);
          background: none;
          border: none;
          padding: 0;
          margin-bottom: 16px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .sr-back:hover { color: var(--sr-ink); }

        .sr-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0 0 4px;
        }

        .sr-subtitle {
          color: var(--sr-muted);
          font-size: 0.9rem;
          margin: 0 0 20px;
        }

        .sr-subtitle strong {
          color: var(--sr-ink);
          font-weight: 600;
        }

        .sr-searchbar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border: 1px solid var(--sr-line);
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 24px;
          max-width: 480px;
        }

        .sr-searchbar input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 0.95rem;
          font-family: inherit;
          background: transparent;
        }

        .sr-meta {
          color: var(--sr-muted);
          font-size: 0.9rem;
          margin-bottom: 18px;
        }

        .sr-group-title {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--sr-muted);
          margin: 22px 0 8px;
        }

        .sr-results {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 10px;
        }

        .sr-item {
          display: block;
          width: 100%;
          text-align: left;
          background: #fff;
          border: 1px solid var(--sr-line);
          border-radius: 10px;
          padding: 12px 14px;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .sr-item:hover {
          border-color: var(--sr-accent);
          background: #F4F8FF;
        }

        .sr-item-type {
          font-size: 0.78rem;
          color: var(--sr-muted);
          margin-bottom: 2px;
        }

        .sr-item-title {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .sr-empty, .sr-error, .sr-loading {
          text-align: center;
          color: var(--sr-muted);
          padding: 80px 20px;
        }

        .sr-empty svg { margin-bottom: 10px; opacity: 0.5; }
      `}</style>

      <div className="sr-container">
        <button className="sr-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} />
          Back
        </button>

        <h1 className="sr-title">Results</h1>
        <p className="sr-subtitle">
          {query ? (
            <>
              Results for <strong>"{query}"</strong>
            </>
          ) : (
            `${tabprm ? tabprm : "Tasks"}  in this project`
          )}
        </p>

        <div className="sr-searchbar">
          <Search size={16} className="text-muted" />
          <input
            autoFocus
            type="text"
            value={inputValue}
            placeholder="Search tasks"
            onChange={(e) => handleInputChange(e.target.value)}
            aria-label="Search this project"
          />
          {inputValue && (
            <X
              size={16}
              className="text-muted"
              style={{ cursor: "pointer" }}
              onClick={() => handleInputChange("")}
            />
          )}
        </div>

        {loading && <div className="sr-loading">Searching…</div>}

        {!loading && error && <div className="sr-error">{error}</div>}

        {!loading && !error && results.length > 0 && (
          <div className="sr-meta">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </div>
        )}

        {showEmptyPrompt && filterprm == null && (
          <div className="sr-empty">
            <Inbox size={28} />
            <div>Type something to search this project</div>
          </div>
        )}

        {showNoResults && (
          <div className="sr-empty">
            <Inbox size={28} />
            <div>No results found</div>
          </div>
        )}

        {!loading &&
          !error &&
          Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <div className="sr-group-title">{type}</div>
              <div className="sr-results">
                {items.map((item) => (
                  <button
                    key={item._id || item.id}
                    className="sr-item"
                    onClick={() => handleResultClick(item)}
                  >
                    <div className="sr-item-type">{item.type}</div>
                    <div className="sr-item-title">{item.title}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SearchResultsPage;
