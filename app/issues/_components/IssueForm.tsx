"use client";

import {
    ErrorMessage,
    Spinner,
} from "@/app/components";
import { createIssueSchema } from "@/app/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type IssueFormData = z.infer<typeof createIssueSchema>;


const IssueForm = ({issue}: {issue? : Issue}) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(createIssueSchema),
  });
  const [error, setError] = useState("");
  const [submitForm, setSubmitForm] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitForm(true);
      await axios.post("/api/issues", data);
      router.push("/issues");
    } catch (error) {
      setSubmitForm(false);
      setError("An Unexpected error occurred");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className=" space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input defaultValue={issue?.title} placeholder="Title" {...register("title")} />
        </TextField.Root>

        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <Controller
          defaultValue={issue?.description}
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />

        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <Button disabled={submitForm}>
          Submit new Issue{submitForm && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;