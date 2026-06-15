// Animation variants for consistent animations across the app

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] as const }
    }
};

export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] as const }
    }
};

export const fadeInDown = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] as const }
    }
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] as const }
    }
};

export const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] as const }
    }
};

export const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95] as const }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

export const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.2, ease: [0.6, 0.01, 0.05, 0.95] as const }
};

export const hoverLift = {
    y: -5,
    transition: { duration: 0.2, ease: [0.6, 0.01, 0.05, 0.95] as const }
};

export const tapScale = {
    scale: 0.95,
    transition: { duration: 0.1 }
};

export const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.6, 0.01, 0.05, 0.95] as const,
            when: "beforeChildren"
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 }
    }
};

export const modalBackdrop = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

export const modalContent = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.6, 0.01, 0.05, 0.95] as const
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: { duration: 0.2 }
    }
};

export const shimmer = {
    animate: {
        backgroundPosition: ["200% 0", "-200% 0"],
        transition: {
            duration: 2,
            ease: "linear",
            repeat: Infinity
        }
    }
};

export const pulseGlow = {
    animate: {
        boxShadow: [
            "0 0 0 0 rgba(99, 102, 241, 0.4)",
            "0 0 0 10px rgba(99, 102, 241, 0)",
            "0 0 0 0 rgba(99, 102, 241, 0)"
        ],
        transition: {
            duration: 2,
            ease: [0.6, 0.01, 0.05, 0.95] as const,
            repeat: Infinity
        }
    }
};

export const bounceIn = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    }
};

export const rotateIn = {
    hidden: { opacity: 0, rotate: -180 },
    visible: {
        opacity: 1,
        rotate: 0,
        transition: {
            duration: 0.6,
            ease: [0.6, 0.01, 0.05, 0.95] as const
        }
    }
};
