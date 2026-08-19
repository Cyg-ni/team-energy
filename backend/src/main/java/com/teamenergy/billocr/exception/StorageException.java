package com.teamenergy.billocr.exception;

/** Thrown when Supabase Storage (an external service) can't be reached or rejects an upload. */
public class StorageException extends RuntimeException {
    public StorageException(String message) {
        super(message);
    }

    public StorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
