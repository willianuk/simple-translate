import type { TextSegment } from "../../types"
import styles from "../translate-widget.module.css"

export interface SegmentListProps {
    segments: string[]
    originalSegments: TextSegment[]
}

export default function SegmentList({
    segments,
    originalSegments
}: SegmentListProps) {
    return (
        <div className={styles.segmentsContainer}>
            {segments.map((segment, index) => {
                const originalSegment = originalSegments[index]
                const segmentType = originalSegment?.type

                return (
                    <div
                        key={index}
                        className={`${styles.segment} ${styles[segmentType] || ""}`}>
                        <div className={styles.segmentText}>{segment}</div>
                    </div>
                )
            })}
        </div>
    )
}
