import { useTransition } from 'react';

export default function Helper() {
    const { t } = useTransition();
    const validation = [
        t("validation.min2Characters"),
        t("validation.max32Characters"),
        t("validation.min8Characters"),
        t("validation.max256Characters"),
        t("validation.notValidEmail"),
        t("validation.requiredField"),
        t("validation.passwordDoNotMatch"),
        t("validation.lowercase"),
        t("validation.uppercase"),
        t("validation.number"),
        t("validation.specialCharacter"),
        t("validation.min14Years"),
        t("validation.tooOld"),
    ]
}
