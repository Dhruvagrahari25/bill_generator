"use client";
import { Combobox } from "@headlessui/react";
import { useState } from "react";

export default function SearchSelect({
    options = [],
    displayKey = "name",
    value,
    onChange,
    placeholder,
}) {
    const [query, setQuery] = useState("");

    const filtered =
        query === ""
            ? options
            : options.filter((o) =>
                o[displayKey]
                    ?.toLowerCase()
                    .includes(query.toLowerCase())
            );

    return (
        <Combobox value={value} onChange={onChange}>
            <div className="relative">
                {/* Input */}
                <Combobox.Input
                    className="border-b outline-none w-full bg-transparent focus:border-black dark:focus:border-white"
                    placeholder={placeholder}
                    displayValue={(o) => o?.[displayKey] || ""}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {/* Options */}
                {filtered.length > 0 && (
                    <Combobox.Options
                        className="
                          absolute z-50 mt-1 max-h-48 w-full
                          overflow-y-auto
                          rounded-md border
                          bg-white text-black
                          dark:bg-black dark:text-white
                          shadow-lg
                        "
                    >
                        {filtered.map((o) => (
                            <Combobox.Option
                                key={o._id}
                                value={o}
                                className={({ active }) =>
                                    `
                                      cursor-pointer px-3 py-2
                                      ${active
                                        ? "bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white"
                                        : ""
                                    }
                                    `
                                }
                            >
                                {o[displayKey]}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
    );
}
