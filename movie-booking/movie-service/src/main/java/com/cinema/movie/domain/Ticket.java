package com.cinema.movie.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "screening_id")
    private Screening screening;

    @Column(name = "row_index", nullable = false)
    private Integer rowIndex;

    @Column(name = "seat_index", nullable = false)
    private Integer seatIndex;

    @Column(name = "is_booked", nullable = false)
    @Builder.Default
    private Boolean isBooked = true;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;
}
