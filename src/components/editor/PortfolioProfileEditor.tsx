"use client";

import Image from "next/image";
import { useState, useTransition } from "react";

import { updatePortfolioProfileAction } from "@/actions/portfolio-actions";
import type { PortfolioData } from "@/types/portfolio";

type PortfolioProfileEditorProps = {
  portfolio: Pick<
    PortfolioData,
    "id" | "title" | "position" | "description" | "avatarUrl"
  >;
};

export function PortfolioProfileEditor({
  portfolio,
}: PortfolioProfileEditorProps) {
  const [title, setTitle] = useState(portfolio.title);
  const [position, setPosition] = useState(portfolio.position ?? "");
  const [description, setDescription] = useState(portfolio.description ?? "");
  const [avatarUrl, setAvatarUrl] = useState(portfolio.avatarUrl ?? "");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isLocalAvatar = avatarUrl.startsWith("/");

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/uploads/images", {
        method: "POST",
        body: formData,
      });

      const result: unknown = await response.json();

      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("imageUrl" in result) ||
        typeof result.imageUrl !== "string"
      ) {
        throw new Error("Image upload failed");
      }

      setAvatarUrl(result.imageUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      setUploadError("Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setErrorMessage(null);

    startTransition(async () => {
      try {
        await updatePortfolioProfileAction(portfolio.id, {
          title: title.trim(),
          position: position.trim(),
          description: description.trim(),
          avatarUrl: avatarUrl.trim(),
        });
      } catch (error) {
        console.error("Failed to save profile:", error);
        setErrorMessage("Failed to save profile.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="lg:sticky lg:top-8">
      <div className="relative mx-auto aspect-square w-full max-w-36 overflow-hidden rounded-2xl bg-neutral-900 sm:max-w-44 lg:mx-0 lg:max-w-none">
        {avatarUrl ? (
          isLocalAvatar ? (
            <Image
              src={avatarUrl}
              alt={title || "Profile photo"}
              fill
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="object-cover"
            />
          ) : (
            <img
              src={avatarUrl}
              alt={title || "Profile photo"}
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-600">
            <span className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              {(title || "?").charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <label className="mt-4 block">
        <span className="text-sm text-neutral-400">Photo</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={isPending || isUploadingImage}
          onChange={handleImageUpload}
          className="mt-2 block w-full text-sm text-neutral-400 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-sm file:text-neutral-200"
        />
      </label>

      {isUploadingImage && (
        <p className="mt-2 text-sm text-neutral-400">Uploading photo...</p>
      )}

      {uploadError && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {uploadError}
        </p>
      )}

      <label className="mt-4 block">
        <span className="text-sm text-neutral-400">Name</span>
        <input
          type="text"
          value={title}
          disabled={isPending}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-white"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm text-neutral-400">Position</span>
        <input
          type="text"
          value={position}
          disabled={isPending}
          onChange={(event) => setPosition(event.target.value)}
          className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-white"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm text-neutral-400">Bio</span>
        <textarea
          value={description}
          disabled={isPending}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-white"
        />
      </label>

      <div className="mt-4 min-h-6">
        {isPending && (
          <p className="text-sm text-neutral-400">Saving profile...</p>
        )}

        {errorMessage && (
          <p role="alert" className="text-sm text-red-400">
            {errorMessage}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || isUploadingImage || !title.trim()}
        className="mt-2 w-full rounded-xl bg-white px-4 py-2 font-medium text-black disabled:opacity-50"
      >
        Save profile
      </button>
    </form>
  );
}
